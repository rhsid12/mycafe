import type { CartItem } from '../types'
import { formatCartLine, getCartTotal } from '../utils/cart'
import { formatPrice } from '../utils/format'

type CartPanelProps = {
  items: CartItem[]
  onOrder: () => void
  ordering?: boolean
}

export function CartPanel({ items, onOrder, ordering = false }: CartPanelProps) {
  const total = getCartTotal(items)
  const isEmpty = items.length === 0

  return (
    <section className="cart-panel" aria-labelledby="cart-title">
      <h2 id="cart-title" className="cart-panel__title">
        장바구니
      </h2>

      {isEmpty ? (
        <p className="cart-panel__empty">장바구니가 비어 있습니다.</p>
      ) : (
        <div className="cart-panel__body">
          <ul className="cart-panel__list">
            {items.map((item) => (
              <li key={item.id} className="cart-panel__item">
                <span className="cart-panel__item-name">
                  {formatCartLine(item)}
                </span>
                <span className="cart-panel__item-price">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="cart-panel__summary">
            <p className="cart-panel__total">
              총 금액 <strong>{formatPrice(total)}</strong>
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onOrder}
              disabled={ordering}
            >
              {ordering ? '주문 중...' : '주문하기'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
