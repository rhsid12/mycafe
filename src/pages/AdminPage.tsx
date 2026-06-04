import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  advanceOrderStatus,
  fetchMenus,
  fetchOrders,
  updateMenuStock,
} from '../api/client'
import type { MenuItem, Order } from '../types'
import { formatPrice } from '../utils/format'
import {
  formatOrderDate,
  formatOrderDescription,
  normalizeOrderStatus,
} from '../utils/order'

type AdminPageProps = {
  refreshKey?: number
}

export function AdminPage({ refreshKey = 0 }: AdminPageProps) {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stockError, setStockError] = useState<string | null>(null)
  const [updatingMenuIds, setUpdatingMenuIds] = useState<Set<number>>(new Set())

  const loadData = useCallback(async () => {
    const [menuData, orderData] = await Promise.all([
      fetchMenus(),
      fetchOrders(),
    ])
    setMenus(menuData)
    setOrders(orderData)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        setLoading(true)
        setError(null)
        await loadData()
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : '데이터를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [loadData])

  useEffect(() => {
    if (refreshKey === 0) return

    loadData().catch((err) => {
      setError(
        err instanceof Error ? err.message : '데이터를 불러오지 못했습니다.',
      )
    })
  }, [refreshKey, loadData])

  const dashboard = useMemo(() => {
    const total = orders.length
    const received = orders.filter(
      (order) => normalizeOrderStatus(order.status) === '주문 접수',
    ).length
    const brewing = orders.filter(
      (order) => normalizeOrderStatus(order.status) === '제조 중',
    ).length
    const completed = orders.filter(
      (order) => normalizeOrderStatus(order.status) === '제조 완료',
    ).length
    return { total, received, brewing, completed }
  }, [orders])

  function setMenuUpdating(menuId: number, busy: boolean) {
    setUpdatingMenuIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(menuId)
      else next.delete(menuId)
      return next
    })
  }

  async function adjustStock(menuId: number, delta: number) {
    setStockError(null)
    setMenuUpdating(menuId, true)

    setMenus((prev) =>
      prev.map((menu) =>
        Number(menu.id) === menuId
          ? {
              ...menu,
              stockQuantity: Math.max(0, menu.stockQuantity + delta),
            }
          : menu,
      ),
    )

    try {
      const updated = await updateMenuStock(menuId, delta)
      setMenus((prev) =>
        prev.map((menu) =>
          Number(menu.id) === Number(updated.id)
            ? { ...menu, stockQuantity: updated.stockQuantity }
            : menu,
        ),
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '재고 수정에 실패했습니다.'
      setStockError(
        `${message} — server 폴더에서 "npm run dev"로 백엔드를 다시 실행해 주세요.`,
      )
      try {
        const menuData = await fetchMenus()
        setMenus(menuData)
      } catch {
        // keep optimistic value if refetch also fails
      }
    } finally {
      setMenuUpdating(menuId, false)
    }
  }

  async function handleAdvanceOrder(orderId: number) {
    try {
      const updated = await advanceOrderStatus(orderId)
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order)),
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : '상태 변경에 실패했습니다.')
    }
  }

  if (loading) {
    return <p className="page-message">관리자 데이터를 불러오는 중...</p>
  }

  if (error) {
    return (
      <p className="page-message page-message--error">
        {error}
        <br />
        <small>server 폴더에서 npm run dev 실행 후 새로고침하세요.</small>
      </p>
    )
  }

  return (
    <div className="admin-page">
      {stockError && (
        <p className="page-message page-message--error">{stockError}</p>
      )}

      <section className="admin-section">
        <h2 className="admin-section__title">관리자 대시보드</h2>
        <p className="admin-dashboard__stats">
          총 주문 {dashboard.total} / 주문 접수 {dashboard.received} / 제조 중{' '}
          {dashboard.brewing} / 제조 완료 {dashboard.completed}
        </p>
      </section>

      <section className="admin-section">
        <h2 className="admin-section__title">재고 현황</h2>
        <div className="admin-stock-grid">
          {menus.map((menu) => {
            const menuId = Number(menu.id)
            const isUpdating = updatingMenuIds.has(menuId)

            return (
              <article key={menu.id} className="admin-stock-card">
                <h3 className="admin-stock-card__name">{menu.name}</h3>
                <p className="admin-stock-card__count">{menu.stockQuantity}개</p>
                <div className="admin-stock-card__actions">
                  <button
                    type="button"
                    className="btn btn--small"
                    aria-label={`${menu.name} 재고 증가`}
                    disabled={isUpdating}
                    onClick={() => adjustStock(menuId, 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn btn--small"
                    aria-label={`${menu.name} 재고 감소`}
                    disabled={isUpdating || menu.stockQuantity <= 0}
                    onClick={() => adjustStock(menuId, -1)}
                  >
                    -
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-section__title">주문 현황</h2>
        {orders.length === 0 ? (
          <p className="page-message">주문이 없습니다.</p>
        ) : (
          <ul className="admin-order-list">
            {orders.map((order) => {
              const status = normalizeOrderStatus(order.status)
              return (
                <li key={order.id} className="admin-order-item">
                  <span>{formatOrderDate(order.orderedAt)}</span>
                  <span>{formatOrderDescription(order)}</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                  <button
                    type="button"
                    className="btn btn--outline btn--status"
                    onClick={() => handleAdvanceOrder(order.id)}
                    disabled={status === '제조 완료'}
                  >
                    {status}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
