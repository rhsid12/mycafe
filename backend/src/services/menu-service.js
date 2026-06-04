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
