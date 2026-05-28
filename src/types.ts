export type MenuOption = {
  id: string
  label: string
  price: number
}

export type MenuItem = {
  id: string
  name: string
  imageUrl: string
  price: number
  description: string
  options: MenuOption[]
}

export type CartItem = {
  id: string
  menuId: string
  name: string
  unitPrice: number
  quantity: number
  optionLabels: string[]
}
