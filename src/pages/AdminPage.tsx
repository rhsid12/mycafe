import { useMemo, useState } from 'react'
import { formatPrice } from '../utils/format'

type StockItem = {
  id: string
  name: string
  quantity: number
}

type OrderStatus = '주문 접수' | '제조 중' | '제조 완료'

type AdminOrder = {
  id: string
  orderedAt: string
  description: string
  totalPrice: number
  status: OrderStatus
}

const INITIAL_STOCKS: StockItem[] = [
  { id: 'americano-ice', name: '아메리카노 (ICE)', quantity: 10 },
  { id: 'americano-hot', name: '아메리카노 (HOT)', quantity: 10 },
  { id: 'cafe-latte', name: '카페라떼', quantity: 10 },
]

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'order-1',
    orderedAt: '7월 31일 13:00',
    description: '아메리카노(ICE) x 1',
    totalPrice: 4000,
    status: '주문 접수',
  },
]

function getNextStatus(status: OrderStatus): OrderStatus {
  if (status === '주문 접수') return '제조 중'
  if (status === '제조 중') return '제조 완료'
  return '제조 완료'
}

export function AdminPage() {
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS)
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS)

  const dashboard = useMemo(() => {
    const total = orders.length
    const received = orders.filter((order) => order.status === '주문 접수').length
    const brewing = orders.filter((order) => order.status === '제조 중').length
    const completed = orders.filter((order) => order.status === '제조 완료').length
    return { total, received, brewing, completed }
  }, [orders])

  function adjustStock(stockId: string, delta: number) {
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === stockId
          ? { ...stock, quantity: Math.max(0, stock.quantity + delta) }
          : stock,
      ),
    )
  }

  function advanceOrder(orderId: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: getNextStatus(order.status) }
          : order,
      ),
    )
  }

  return (
    <div className="admin-page">
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
          {stocks.map((stock) => (
            <article key={stock.id} className="admin-stock-card">
              <h3 className="admin-stock-card__name">{stock.name}</h3>
              <p className="admin-stock-card__count">{stock.quantity}개</p>
              <div className="admin-stock-card__actions">
                <button
                  type="button"
                  className="btn btn--small"
                  aria-label={`${stock.name} 재고 증가`}
                  onClick={() => adjustStock(stock.id, 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="btn btn--small"
                  aria-label={`${stock.name} 재고 감소`}
                  onClick={() => adjustStock(stock.id, -1)}
                >
                  -
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-section__title">주문 현황</h2>
        <ul className="admin-order-list">
          {orders.map((order) => (
            <li key={order.id} className="admin-order-item">
              <span>{order.orderedAt}</span>
              <span>{order.description}</span>
              <span>{formatPrice(order.totalPrice)}</span>
              <button
                type="button"
                className="btn btn--outline btn--status"
                onClick={() => advanceOrder(order.id)}
                disabled={order.status === '제조 완료'}
              >
                {order.status}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
