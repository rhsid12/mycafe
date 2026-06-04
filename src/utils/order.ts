import type { Order } from '../types'

export function formatOrderDate(isoDate: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(isoDate))
}

export function formatOrderDescription(order: Order): string {
  return order.items
    .map((item) => {
      const optionText =
        item.options.length > 0
          ? ` (${item.options.map((o) => o.name).join(', ')})`
          : ''
      return `${item.menuName}${optionText} x ${item.quantity}`
    })
    .join(', ')
}

export function normalizeOrderStatus(status: string): string {
  return status === '완료' ? '제조 완료' : status
}
