'use client'

import React, {useRef} from 'react'
import Link from 'next/link'
import {IProduct} from '../../../app-store/types'
import {getCitySlug} from '../../../util/city.util'
import {productPhotoUrl} from '../../../util/product-image.util'
import {PlusIcon, BoltIcon} from './icons'
import {useAddToCart} from './useAddToCart'

const KNOWN_BRANDS = [
  'Canon',
  'Nikon',
  'Sony',
  'Fujifilm',
  'Panasonic',
  'Olympus',
  'Pentax',
  'Leica',
  'GoPro',
  'DJI',
  'Insta360',
  'Godox',
  'Aputure',
  'Sigma',
  'Tamron',
  'Tokina',
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

interface ProductTileProps {
  product: IProduct
  featured?: boolean
  // For above-the-fold tiles — disables lazy loading (eager) and, when
  // `priority`, also tags the request fetchpriority=high so the browser
  // races it against critical CSS instead of queueing behind it. Listing
  // pages should mark the first ~6 tiles `eager` and the very first one
  // `priority` (it's typically the LCP element).
  eager?: boolean
  priority?: boolean
}

export default function ProductTile({
  product,
  featured = false,
  eager = false,
  priority = false,
}: ProductTileProps) {
  const tileRef = useRef<HTMLAnchorElement>(null)
  const {add, fly, pendingId} = useAddToCart()
  const {brand, name} = splitBrand(product.title)
  const rate = product.rate || product.rates?.[0]?.rate || 0
  const url = `/${getCitySlug(product?.location?.city)}/${product?.subCategory?.slug ?? 'rent-camera'}/${product.slug}`
  const img = productPhotoUrl(product, featured ? 320 : 240)
  const isPopular = !!product.featured

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = tileRef.current?.getBoundingClientRect() ?? null
    add({productId: product.id, productName: product.title, rate, fromRect: rect})
  }

  return (
    <Link
      ref={tileRef}
      href={url}
      className={`relative block rounded-[20px] overflow-hidden bg-surface border border-line-soft transition-shadow hover:shadow-card-hover ${
        featured ? 'col-span-2 md:col-span-1 aspect-[2/1.15] md:aspect-[1/1.25]' : 'aspect-[1/1.25]'
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: isPopular
            ? 'radial-gradient(90% 70% at 50% 50%, #FFF5D6, #FAF8F2)'
            : 'radial-gradient(90% 70% at 50% 50%, #F3F1EA, #FAFAF7)',
        }}
      />
      {isPopular && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-accent text-ink text-[10px] font-extrabold px-2 py-1 rounded-full inline-flex items-center gap-1">
          <BoltIcon size={10} /> Popular
        </div>
      )}
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={product.title}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={`absolute inset-0 w-full h-full object-contain ${
            featured ? 'p-6' : 'p-4.5'
          }`}
          style={{filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.12))'}}
        />
      )}
      <div className="absolute left-0 right-0 bottom-0 px-3 pt-2.5 pb-3 bg-gradient-to-t from-surface from-70% to-transparent">
        {brand && (
          <div className="text-[10px] font-bold text-ink-muted tracking-kicker uppercase">
            {brand}
          </div>
        )}
        <div className="text-[14px] font-bold text-ink leading-tight mt-0.5 line-clamp-1">
          {name || product.title}
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <div className="font-mono text-[16px] font-extrabold text-ink">
            ₹{Math.round(rate).toLocaleString('en-IN')}
            <span className="text-[11px] text-ink-muted font-medium">/day</span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={pendingId === product.id}
            aria-label={`Add ${product.title} to cart`}
            className="w-[34px] h-[34px] rounded-full bg-ink text-surface flex items-center justify-center disabled:opacity-50"
          >
            <PlusIcon size={18} />
          </button>
        </div>
      </div>

      {fly && img && (
        <FlyClone
          src={img}
          fromX={fly.fromX}
          fromY={fly.fromY}
          width={fly.width}
          height={fly.height}
          toX={fly.toX}
          toY={fly.toY}
        />
      )}
    </Link>
  )
}

function FlyClone(props: {
  src: string
  fromX: number
  fromY: number
  width: number
  height: number
  toX: number
  toY: number
}) {
  const {src, fromX, fromY, width, height, toX, toY} = props
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-50 pointer-events-none animate-fly"
      style={
        {
          width,
          height,
          ['--fx' as any]: `${fromX}px`,
          ['--fy' as any]: `${fromY}px`,
          ['--tx' as any]: `${toX}px`,
          ['--ty' as any]: `${toY}px`,
        } as React.CSSProperties
      }
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain"
        style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))'}}
      />
    </div>
  )
}
