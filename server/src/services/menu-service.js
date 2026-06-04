import { pool } from '../db.js'

export async function getMenusWithOptions() {
  const menuResult = await pool.query(
    `SELECT id, name, description, price, image_url, stock_quantity
     FROM menus
     ORDER BY id`,
  )
  const optionResult = await pool.query(
    `SELECT id, menu_id, name, price
     FROM options
     ORDER BY id`,
  )

  return menuResult.rows.map((menu) => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: menu.price,
    imageUrl: menu.image_url,
    stockQuantity: menu.stock_quantity,
    options: optionResult.rows
      .filter((opt) => opt.menu_id === menu.id)
      .map((opt) => ({
        id: opt.id,
        name: opt.name,
        price: opt.price,
      })),
  }))
}

export async function updateMenuStock(menuId, delta) {
  const result = await pool.query(
    `UPDATE menus
     SET stock_quantity = GREATEST(0, stock_quantity + $1),
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, stock_quantity`,
    [delta, menuId],
  )

  if (result.rowCount === 0) {
    throw new Error('메뉴를 찾을 수 없습니다.')
  }

  const menu = result.rows[0]
  return {
    id: menu.id,
    name: menu.name,
    stockQuantity: menu.stock_quantity,
  }
}
