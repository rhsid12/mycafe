import { withTransaction } from '../db.js'

const STATUS_FLOW = ['주문 접수', '제조 중', '제조 완료']

function nextStatus(status) {
  const idx = STATUS_FLOW.indexOf(status)
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return status
  return STATUS_FLOW[idx + 1]
}

export async function createOrder(payload) {
  return withTransaction(async (client) => {
    const { items } = payload
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('주문 항목이 비어 있습니다.')
    }

    let totalPrice = 0
    const prepared = []

    for (const item of items) {
      const { menuId, quantity, optionIds = [] } = item
      if (!menuId || !quantity || quantity < 1) {
        throw new Error('주문 항목 형식이 올바르지 않습니다.')
      }

      const menuRes = await client.query(
        'SELECT id, name, price, stock_quantity FROM menus WHERE id = $1 FOR UPDATE',
        [menuId],
      )
      if (menuRes.rowCount === 0) throw new Error(`메뉴(${menuId})를 찾을 수 없습니다.`)

      const menu = menuRes.rows[0]
      if (menu.stock_quantity < quantity) {
        throw new Error(`${menu.name} 재고가 부족합니다.`)
      }

      const optionRes = optionIds.length
        ? await client.query(
            `SELECT id, name, price
             FROM options
             WHERE menu_id = $1 AND id = ANY($2::int[])`,
            [menuId, optionIds],
          )
        : { rows: [] }

      if (optionRes.rows.length !== optionIds.length) {
        throw new Error(`${menu.name}의 옵션 정보가 올바르지 않습니다.`)
      }

      const optionsPrice = optionRes.rows.reduce((sum, opt) => sum + opt.price, 0)
      const unitPrice = menu.price + optionsPrice
      totalPrice += unitPrice * quantity

      prepared.push({ menu, quantity, unitPrice, options: optionRes.rows })
    }

    const orderRes = await client.query(
      `INSERT INTO orders (status, total_price)
       VALUES ('주문 접수', $1)
       RETURNING id, status, total_price, ordered_at`,
      [totalPrice],
    )
    const order = orderRes.rows[0]

    for (const item of prepared) {
      const orderItemRes = await client.query(
        `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [order.id, item.menu.id, item.menu.name, item.quantity, item.unitPrice],
      )

      await client.query(
        `UPDATE menus
         SET stock_quantity = stock_quantity - $1, updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.menu.id],
      )

      for (const option of item.options) {
        await client.query(
          `INSERT INTO order_item_options (order_item_id, option_name, option_price)
           VALUES ($1, $2, $3)`,
          [orderItemRes.rows[0].id, option.name, option.price],
        )
      }
    }

    return getOrderById(order.id, client)
  })
}

export async function getOrderById(orderId, externalClient = null) {
  const client = externalClient
  if (!client) {
    return withTransaction(async (tx) => getOrderById(orderId, tx))
  }

  const orderRes = await client.query(
    `SELECT id, status, total_price, ordered_at
     FROM orders
     WHERE id = $1`,
    [orderId],
  )
  if (orderRes.rowCount === 0) return null
  const order = orderRes.rows[0]

  const itemRes = await client.query(
    `SELECT id, menu_id, menu_name, quantity, unit_price
     FROM order_items
     WHERE order_id = $1
     ORDER BY id`,
    [orderId],
  )

  const itemIds = itemRes.rows.map((row) => row.id)
  const optionRes = itemIds.length
    ? await client.query(
        `SELECT order_item_id, option_name, option_price
         FROM order_item_options
         WHERE order_item_id = ANY($1::int[])`,
        [itemIds],
      )
    : { rows: [] }

  return {
    id: order.id,
    status: order.status,
    totalPrice: order.total_price,
    orderedAt: order.ordered_at,
    items: itemRes.rows.map((item) => ({
      menuId: item.menu_id,
      menuName: item.menu_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      options: optionRes.rows
        .filter((opt) => opt.order_item_id === item.id)
        .map((opt) => ({ name: opt.option_name, price: opt.option_price })),
    })),
  }
}

export async function getOrders() {
  return withTransaction(async (client) => {
    const ordersRes = await client.query(
      `SELECT id
       FROM orders
       ORDER BY ordered_at DESC`,
    )
    const orders = []
    for (const row of ordersRes.rows) {
      const order = await getOrderById(row.id, client)
      if (order) orders.push(order)
    }
    return orders
  })
}

export async function advanceOrderStatus(orderId) {
  return withTransaction(async (client) => {
    const res = await client.query(
      `SELECT status FROM orders WHERE id = $1 FOR UPDATE`,
      [orderId],
    )
    if (res.rowCount === 0) return null
    const newStatus = nextStatus(res.rows[0].status)
    await client.query(
      `UPDATE orders SET status = $1 WHERE id = $2`,
      [newStatus, orderId],
    )
    return getOrderById(orderId, client)
  })
}
