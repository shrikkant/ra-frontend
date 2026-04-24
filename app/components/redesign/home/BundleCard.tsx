import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BundleProduct {
  src: string
  alt: string
}

interface BundleCardProps {
  href?: string
  kicker?: string
  title?: string
  savingsLabel?: string
  bundlePrice?: number
  retailPrice?: number
  products?: BundleProduct[]
}

const DEFAULT_PRODUCTS: BundleProduct[] = [
  {
    src: '/assets/v2/img/canon-r10-mirrorless-camera.webp',
    alt: 'Canon EOS R10',
  },
  {src: '/assets/v2/img/godox-sl60w-light.webp', alt: 'Godox SL-60W light'},
]

export default function BundleCard({
  href = '/pune/rent-camera?q=',
  kicker = 'Wedding kit · 3 items',
  title = 'Canon R10 + 50mm + SL-60W',
  savingsLabel = 'Save 22% vs booking separately',
  bundlePrice = 1550,
  retailPrice = 2000,
  products = DEFAULT_PRODUCTS,
}: BundleCardProps) {
  return (
    <div className="px-4 md:px-0">
      <Link
        href={href}
        className="relative h-[150px] md:h-[200px] rounded-4xl overflow-hidden flex items-stretch bg-gradient-to-br from-ink to-[#1a1a18] shadow-card-hover no-underline"
      >
        <div className="px-4.5 md:px-8 pt-4.5 md:pt-8 pb-4 md:pb-7 flex-1 min-w-0">
          <div className="text-[11px] md:text-[12px] uppercase tracking-kicker font-bold text-accent">
            {kicker}
          </div>
          <div className="text-[18px] md:text-[24px] lg:text-[28px] font-extrabold text-surface mt-1 leading-tight line-clamp-2">
            {title}
          </div>
          <div className="text-[12px] md:text-[14px] text-white/70 mt-1.5">{savingsLabel}</div>
          <div className="mt-3.5 md:mt-5 flex items-baseline gap-2">
            <span className="font-mono text-[22px] md:text-[28px] font-extrabold text-surface">
              ₹{bundlePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[12px] md:text-[14px] text-white/50 line-through">
              ₹{retailPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] md:text-[12px] text-white/50">/ day</span>
          </div>
        </div>
        <div className="relative w-[160px] md:w-[280px] shrink-0 flex items-center justify-center">
          {products.slice(0, 2).map((p, i) => (
            <div
              key={i}
              className="absolute w-[110px] h-[110px] bg-bg rounded-[14px] p-2.5"
              style={{
                transform:
                  i === 0
                    ? 'translate(0, 8px) rotate(-6deg)'
                    : 'translate(-10px, -6px) rotate(6deg)',
                zIndex: i + 1,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="110px"
                className="object-contain p-1.5"
              />
            </div>
          ))}
        </div>
      </Link>
    </div>
  )
}
