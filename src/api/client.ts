import type { CreateOrderPayload, MenuItem, Order } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const text = await response.text()
  let data: { message?: string } = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'API를 찾을 수 없습니다. server 폴더에서 npm run dev 로 서버를 다시 실행해 주세요.'
        : '요청에 실패했습니다.'
    throw new Error(
      typeof data.message === 'string' ? data.message : fallback,
    )
  }

  return (text ? JSON.parse(text) : {}) as T
}

export function fetchMenus() {
  return request<MenuItem[]>('/menus')
}

export function createOrder(payload: CreateOrderPayload) {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchOrders() {
  return request<Order[]>('/orders')
}

export function advanceOrderStatus(orderId: number) {
  return request<Order>(`/orders/${orderId}/status`, { method: 'PATCH' })
}

export function updateMenuStock(menuId: number, delta: number) {
  return request<{ id: number; name: string; stockQuantity: number }>(
    `/menus/${menuId}/stock`,
    {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    },
  )
}
