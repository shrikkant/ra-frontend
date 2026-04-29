'use client'

import React, {useRef} from 'react'
import Link from 'next/link'
import {useSelector} from 'react-redux'
import {IProduct} from '../../../../app-store/types'
import {getCitySlug} from '../../../../util/city.util'
import {productPhotoUrl} from '../../../../util/product-image.util'
import {PlusIcon} from '../icons'
import {useAddToCart} from '../useAddToCart'
import {hasDates as hasDatesSelector} from '../../../../app-store/session/session.slice'
import {useDatePicker} from '../DatePickerProvider'

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
  const [first, ...rest] = trimmed.split(' ')
  return rest.length > 0
    ? {brand: first, name: rest.join(' ')}
    : {brand: '', name: trimmed}
}

interface ProductRowProps {
  product: IProduct
  // Above-the-fold rows — disable lazy loading. Apply to the first ~4
  // rows: LCP picks the largest visible image, and only marking the
  // first row eager meant a later above-fold image (still lazy) often
  // won LCP and waited on intersection-observer.
  eager?: boolean
  // The LCP candidate (typically just the first row). Sets
  // fetchpriority=high so the browser races this image past CSS/JS.
  priority?: boolean
}

export default function ProductRow({
  product,
  eager = false,
  priority = false,
}: ProductRowProps) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const {add, fly, pendingId} = useAddToCart()
  const hasDates = useSelector(hasDatesSelector)
  const {open: openDatePicker} = useDatePicker()
  const {brand, name} = splitBrand(product.title)
  const rate = product.rate || product.rates?.[0]?.rate || 0
  const url = `/${getCitySlug(product?.location?.city)}/${product?.subCategory?.slug ?? 'rent-camera'}/${product.slug}`
  // Container is 96px (w-24) → at 2× DPR the image area inside the p-2.5
  // padding is ~152 device px. 160 gives a small buffer over the displayed
  // size without shipping the wasted bytes Lighthouse flagged at 192.
  const img = productPhotoUrl(product, 160)
  const tags = product.subCategory?.title ? [product.subCategory.title] : []

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasDates) {
      openDatePicker()
      return
    }
    const rect = rowRef.current?.getBoundingClientRect() ?? null
    add({productId: product.id, productName: product.title, rate, fromRect: rect})
  }

  return (
    <Link
      ref={rowRef}
      href={url}
      className="relative flex items-center gap-3 px-4 py-3 bg-surface no-underline"
    >
      <div className="relative w-24 h-24 rounded-[14px] bg-surface-muted shrink-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 50% 50%, rgba(245,197,24,0.12), transparent 70%)',
          }}
        />
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.title}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 w-full h-full object-contain p-2.5"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {brand && (
          <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted">
            {brand}
          </div>
        )}
        <div className="text-[15px] font-bold text-ink leading-tight line-clamp-2">
          {name || product.title}
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {tags.map(t => (
              <span
                key={t}
                className="text-[10px] font-semibold text-ink-secondary bg-surface-muted px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="font-mono text-[15px] font-extrabold text-ink mt-1.5">
          ₹{Math.round(rate).toLocaleString('en-IN')}
          <span className="text-[11px] text-ink-muted font-medium">/day</span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={pendingId === product.id}
        aria-label={
          hasDates
            ? `Add ${product.title} to cart`
            : `Pick rental dates to add ${product.title} to cart`
        }
        className={`shrink-0 inline-flex items-center gap-1 text-[13px] font-bold px-3 py-2 rounded-full disabled:opacity-50 ${
          hasDates
            ? 'bg-ink text-surface'
            : 'bg-surface border border-line text-ink-muted'
        }`}
      >
        <PlusIcon size={14} />
        Add
      </button>

      {fly && img && (
        <div
          aria-hidden
          className="fixed top-0 left-0 z-50 pointer-events-none animate-fly"
          style={
            {
              width: fly.width,
              height: fly.height,
              ['--fx' as any]: `${fly.fromX}px`,
              ['--fy' as any]: `${fly.fromY}px`,
              ['--tx' as any]: `${fly.toX}px`,
              ['--ty' as any]: `${fly.toY}px`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt=""
            className="w-full h-full object-contain"
            style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))'}}
          />
        </div>
      )}
    </Link>
  )
}
