import { useState } from 'react'
import { CartPanel } from '../components/CartPanel'
import { MenuCard } from '../components/MenuCard'
import { MENU_ITEMS } from '../data/menus'
import type { CartItem, MenuItem } from '../types'
import { createCartItem } from '../utils/cart'

export function OrderPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  function handleAddToCart(menu: MenuItem, selectedOptionIds: string[]) {
    const newItem = createCartItem(menu, selectedOptionIds)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id)
      if (!existing) return [...prev, newItem]

      return prev.map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })
  }

  function handleOrder() {
    if (cartItems.length === 0) {
      alert('장바구니가 비어 있습니다.')
      return
    }
    alert('주문이 접수되었습니다.')
    setCartItems([])
  }

  return (
    <div className="order-page">
      <div className="menu-grid">
        {MENU_ITEMS.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={handleAddToCart} />
        ))}
      </div>
      <CartPanel items={cartItems} onOrder={handleOrder} />
    </div>
  )
}
