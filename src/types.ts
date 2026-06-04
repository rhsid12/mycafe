export type MenuOption = {
  id: number
  name: string
  price: number
}

export type MenuItem = {
  id: number
  name: string
  imageUrl: string
  price: number
  description: string
  stockQuantity: number
  options: MenuOption[]
}

export type CartItem = {
  id: string
  menuId: number
  name: string
  unitPrice: number
  quantity: number
  optionIds: number[]
  optionLabels: string[]
}

export type OrderItem = {
  menuId: number
  menuName: string
  quantity: number
  unitPrice: number
  options: { name: string; price: number }[]
}

export type Order = {
  id: number
  status: string
  totalPrice: number
  orderedAt: string
  items: OrderItem[]
}

export type CreateOrderPayload = {
  items: {
    menuId: number
    quantity: number
    optionIds: number[]
  }[]
}
