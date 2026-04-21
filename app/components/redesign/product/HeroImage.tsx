import React from 'react'
import Image from 'next/image'
import {IProduct} from '../../../../app-store/types'

interface HeroImageProps {
  product: IProduct
}

function productImage(product: IProduct, width: number): string {
  if (product.master_product_id) {
    return `https://rentacross.com/api/products/${product.master_product_id}/photo?width=${width}`
  }
  const photo = product.photos?.[0] ?? product.masterPhotos?.[0]
  return photo?.path ?? ''
}

export default function HeroImage({product}: HeroImageProps) {
  const img = productImage(product, 800)
  return (
    <div
      className="relative h-[340px] w-full overflow-hidden"
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
        <Image
          src={img}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain"
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
