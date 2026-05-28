import { useState } from 'react'
import type { MenuItem } from '../types'
import { formatPrice } from '../utils/format'

type MenuCardProps = {
  menu: MenuItem
  onAdd: (menu: MenuItem, selectedOptionIds: string[]) => void
}

export function MenuCard({ menu, onAdd }: MenuCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  function toggleOption(optionId: string) {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    )
  }

  function handleAdd() {
    onAdd(menu, selectedOptions)
    setSelectedOptions([])
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="menu-card__image-content"
          loading="lazy"
        />
      </div>
      <h2 className="menu-card__name">{menu.name}</h2>
      <p className="menu-card__price">{formatPrice(menu.price)}</p>
      <p className="menu-card__description">{menu.description}</p>
      <ul className="menu-card__options">
        {menu.options.map((option) => (
          <li key={option.id}>
            <label className="menu-card__option">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              <span>
                {option.label}
                {option.price > 0
                  ? ` (+${formatPrice(option.price)})`
                  : ' (+0원)'}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--outline" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}
