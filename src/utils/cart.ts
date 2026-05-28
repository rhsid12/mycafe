import type { CartItem, MenuItem } from '../types'

export function buildCartItemKey(
  menuId: string,
  optionIds: string[],
): string {
  return `${menuId}:${[...optionIds].sort().join(',')}`
}

export function createCartItem(
  menu: MenuItem,
  selectedOptionIds: string[],
): CartItem {
  const selectedOptions = menu.options.filter((o) =>
    selectedOptionIds.includes(o.id),
  )
  const optionsPrice = selectedOptions.reduce((sum, o) => sum + o.price, 0)

  return {
    id: buildCartItemKey(menu.id, selectedOptionIds),
    menuId: menu.id,
    name: menu.name,
    unitPrice: menu.price + optionsPrice,
    quantity: 1,
    optionLabels: selectedOptions.map((o) => o.label),
  }
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function formatCartLine(item: CartItem): string {
  const options =
    item.optionLabels.length > 0
      ? ` (${item.optionLabels.join(', ')})`
      : ''
  return `${item.name}${options} X ${item.quantity}`
}
