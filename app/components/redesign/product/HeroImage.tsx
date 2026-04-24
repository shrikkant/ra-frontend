import React from 'react'
import {IProduct} from '../../../../app-store/types'
import {productPhotoUrl} from '../../../../util/product-image.util'

interface HeroImageProps {
  product: IProduct
}

export default function HeroImage({product}: HeroImageProps) {
  const img = productPhotoUrl(product, 800)
  return (
    <div
      className="relative h-[340px] md:h-[480px] lg:h-[560px] w-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FAFAF7 0%, #F3F1EA 100%)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 55%, rgba(245,197,24,0.22), transparent 70%)',
        }}
      />
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            padding: '52px 28px 48px',
            filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.2))',
          }}
        />
      )}
      <Pagination />
    </div>
  )
}

function Pagination() {
  // Static pagination dots — the first is wide per the design spec.
  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-1.5"
    >
      <span className="h-1.5 w-5 rounded-full bg-ink" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
    </div>
  )
}
