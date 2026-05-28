import type { MenuItem } from '../types'
import americanoIceImg from '../assets/menu/americano-ice.svg'
import americanoHotImg from '../assets/menu/americano-hot.svg'
import cafeLatteImg from '../assets/menu/cafe-latte.svg'

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    imageUrl: americanoIceImg,
    price: 4000,
    description: '간단한 설명...',
    options: [
      { id: 'shot', label: '샷 추가', price: 500 },
      { id: 'syrup', label: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    imageUrl: americanoHotImg,
    price: 4000,
    description: '간단한 설명...',
    options: [
      { id: 'shot', label: '샷 추가', price: 500 },
      { id: 'syrup', label: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    imageUrl: cafeLatteImg,
    price: 5000,
    description: '간단한 설명...',
    options: [
      { id: 'shot', label: '샷 추가', price: 500 },
      { id: 'syrup', label: '시럽 추가', price: 0 },
    ],
  },
]
