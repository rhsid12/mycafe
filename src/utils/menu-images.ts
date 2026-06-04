import americanoIceImg from '../assets/menu/americano-ice.svg'
import americanoHotImg from '../assets/menu/americano-hot.svg'
import cafeLatteImg from '../assets/menu/cafe-latte.svg'
import type { MenuItem } from '../types'

const IMAGE_BY_PATH: Record<string, string> = {
  '/images/americano-ice.svg': americanoIceImg,
  '/images/americano-hot.svg': americanoHotImg,
  '/images/cafe-latte.svg': cafeLatteImg,
}

export function resolveMenuImage(imageUrl: string): string {
  return IMAGE_BY_PATH[imageUrl] ?? imageUrl
}

export function withMenuImages(menus: MenuItem[]): MenuItem[] {
  return menus.map((menu) => ({
    ...menu,
    imageUrl: resolveMenuImage(menu.imageUrl),
  }))
}
