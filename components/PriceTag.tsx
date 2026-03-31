import React from 'react'
import {APP_LOCALE, DEFAULT_CURRENCY} from '../config/constants'

export default function PriceTag({
  price,
  size = 'md',
  sub = null,
  discount = 0,
}: {
  price: number
  size?: 'sm' | 'md' | 'lg'
  sub?: string | null
  showCurrency?: boolean
  discount?: number
}) {
  const originalPrice = price
  const priceAfterDiscount = Math.ceil(originalPrice - (price * discount) / 100)

  const sizeClasses = {
    sm: {price: 'text-lg', original: 'text-sm', discount: 'text-xs'},
    md: {price: 'text-xl', original: 'text-base', discount: 'text-sm'},
    lg: {price: 'text-2xl', original: 'text-lg', discount: 'text-base'},
  }
  const s = sizeClasses[size]

  return (
    <div className="flex items-baseline gap-x-1.5 flex-wrap">
      {discount > 0 && (
        <div className={`font-bold text-gray-900 ${s.price}`}>
          {getPrice(priceAfterDiscount)}
          {sub && <sub className="font-semibold">{sub}</sub>}
        </div>
      )}

      <div
        className={`font-light text-gray-500 ${s.original} ${discount > 0 ? 'line-through' : ''}`}
      >
        {getPrice(price)}
        {sub && <span className="text-sm font-light">{sub}</span>}
      </div>
      {discount > 0 && (
        <span className={`text-green-600 font-semibold ${s.discount}`}>{discount}% off</span>
      )}
    </div>
  )
}

function getPrice(price) {
  return price.toLocaleString(APP_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
