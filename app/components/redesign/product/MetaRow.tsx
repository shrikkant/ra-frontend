import React from 'react'
import {IProduct} from '../../../../app-store/types'
import {StarIcon, BoltIcon} from '../icons'

const KNOWN_BRANDS = [
  'Canon',
  'Nikon',
  'Sony',
  'Fujifilm',
  'Panasonic',
  'GoPro',
  'DJI',
  'Insta360',
  'Godox',
  'Aputure',
  'Sigma',
  'Tamron',
  'Manfrotto',
  'Rode',
  'Zhiyun',
]

function splitBrand(title: string): {brand: string; name: string} {
  const trimmed = title.trim()
  for (const b of KNOWN_BRANDS) {
    if (trimmed.toLowerCase().startsWith(b.toLowerCase() + ' ')) {
      return {brand: b, name: trimmed.slice(b.length + 1).trim()}
    }
  }
  return {brand: '', name: trimmed}
}

export default function MetaRow({product}: {product: IProduct}) {
  const {brand, name} = splitBrand(product.title)
  const kind = product.subCategory?.title
  const stock = typeof product.qty === 'number' ? product.qty : null
  const lowStock = stock !== null && stock <= 2

  return (
    <div className="px-4 lg:px-0 pt-5 lg:pt-0">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
        {brand && <span>{brand}</span>}
        {brand && kind && <span aria-hidden>·</span>}
        {kind && <span>{kind}</span>}
        {product.featured && (
          <span className="ml-auto inline-flex items-center gap-1 bg-accent text-ink text-[10px] font-extrabold px-2 py-0.5 rounded-full normal-case tracking-normal">
            <BoltIcon size={10} /> Popular
          </span>
        )}
      </div>
      <h1 className="text-[28px] lg:text-[36px] font-extrabold tracking-tight-lg text-ink leading-[1.05] mt-1.5">
        {name || product.title}
      </h1>
      <div className="mt-2.5 flex items-center gap-3 text-[13px]">
        <div className="inline-flex items-center gap-1 text-ink">
          <StarIcon size={14} className="text-accent" />
          <span className="font-bold">4.9</span>
          <span className="text-ink-muted">(128)</span>
        </div>
        {stock !== null && (
          <div
            className={`inline-flex items-center gap-1 ${
              lowStock ? 'text-danger' : 'text-success'
            }`}
          >
            <span
              aria-hidden
              className={`block w-1.5 h-1.5 rounded-full ${
                lowStock ? 'bg-danger' : 'bg-success'
              }`}
            />
            {lowStock ? `Only ${stock} left` : 'In stock'}
          </div>
        )}
      </div>
    </div>
  )
}
