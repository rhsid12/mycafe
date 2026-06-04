import { useEffect, useState } from 'react'
import { createOrder, fetchMenus } from '../api/client'
import { CartPanel } from '../components/CartPanel'
import { MenuCard } from '../components/MenuCard'
import type { CartItem, MenuItem } from '../types'
import { createCartItem, getMenuQuantityInCart } from '../utils/cart'
import { withMenuImages } from '../utils/menu-images'

type OrderPageProps = {
  onOrderComplete?: () => void
}

export function OrderPage({ onOrderComplete }: OrderPageProps) {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ordering, setOrdering] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMenus() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchMenus()
        if (!cancelled) setMenus(withMenuImages(data))
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : '메뉴를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadMenus()
    return () => {
      cancelled = true
    }
  }, [])

  async function reloadMenus() {
    const data = await fetchMenus()
    setMenus(withMenuImages(data))
  }

  function handleAddToCart(menu: MenuItem, selectedOptionIds: number[]) {
    const inCart = getMenuQuantityInCart(cartItems, menu.id)
    if (inCart >= menu.stockQuantity) {
      alert(`${menu.name} 재고가 부족합니다. (남은 재고: ${menu.stockQuantity}개)`)
      return
    }

    const newItem = createCartItem(menu, selectedOptionIds)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id)
      const next = existing
        ? prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prev, newItem]

      const nextQty = getMenuQuantityInCart(next, menu.id)
      if (nextQty > menu.stockQuantity) {
        alert(`${menu.name} 재고가 부족합니다. (남은 재고: ${menu.stockQuantity}개)`)
        return prev
      }

      return next
    })
  }

  async function handleOrder() {
    if (cartItems.length === 0) {
      alert('장바구니가 비어 있습니다.')
      return
    }

    try {
      setOrdering(true)
      await createOrder({
        items: cartItems.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          optionIds: item.optionIds,
        })),
      })
      onOrderComplete?.()
      await reloadMenus()
      alert('주문이 접수되었습니다.')
      setCartItems([])
    } catch (err) {
      alert(err instanceof Error ? err.message : '주문에 실패했습니다.')
    } finally {
      setOrdering(false)
    }
  }

  if (loading) {
    return <p className="page-message">메뉴를 불러오는 중...</p>
  }

  if (error) {
    return <p className="page-message page-message--error">{error}</p>
  }

  return (
    <div className="order-page">
      <div className="menu-grid">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={handleAddToCart} />
        ))}
      </div>
      <CartPanel
        items={cartItems}
        onOrder={handleOrder}
        ordering={ordering}
      />
    </div>
  )
}
