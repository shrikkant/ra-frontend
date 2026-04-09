import React from 'react'
import Link from 'next/link'
import {IProduct} from '../../app-store/types'
import {getCitySlug} from '../../util/city.util'
import LazyImage from '../product/LazyImage'

export default function HomeProductCard({product}: {product: IProduct}) {
  const dailyRent = product?.rates?.[0]?.rate || 0
  const discount = product?.discount_percent || 0
  const discountedPrice =
    discount > 0
      ? Math.ceil(dailyRent - (dailyRent * discount) / 100)
      : dailyRent
  const url = `/${getCitySlug(product?.location?.city)}/${product?.subCategory?.slug}/${product.slug}`

  return (
    <Link href={url} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Image — visual first */}
        <div className="aspect-square relative overflow-hidden">
          {product.master_product_id && (
            <LazyImage
              src={`https://rentacross.com/api/products/${product.master_product_id}/photo?width=240`}
              alt={product.title || 'Rental equipment'}
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              width={240}
              height={240}
              priority={false}
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmOWY5Ii8+PC9zdmc+"
            />
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount}% off
            </span>
          )}
        </div>

        {/* Info — minimal */}
        <div className="px-3 py-2.5 pb-3">
          <h3 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 mb-1.5">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-gray-900">
              ₹{discountedPrice}
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-gray-500 line-through">
                ₹{dailyRent}
              </span>
            )}
            <span className="text-[11px] text-gray-500">/day</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
