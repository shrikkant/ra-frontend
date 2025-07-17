import {IProduct} from '../../app-store/types'
import React from 'react'
import {MapPinIcon} from '@heroicons/react/24/outline'

interface ProductProps {
  product: IProduct
}

export const HeadCard: React.FC<ProductProps> = ({product}: ProductProps) => {
  return (
    <div className="p-6 lg:p-8">
      {/* Product Image */}
      {product?.master_product_id && (
        <div className="mb-6 lg:mb-8 px-4 lg:px-8">
          <div className="relative aspect-[4/3] w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-gray-100">
            <img
              src={`/api/products/${product.master_product_id}/photo?width=800`}
              alt={product.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              width={800}
              height={600}
              loading="eager"
            />
            {/* Image overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      )}

      {/* Product Title and Location */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
          {product.title}
        </h1>

        <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4 lg:mb-6">
          <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-gray-400" />
          <span className="text-lg lg:text-xl font-medium">
            {product.location.city}
          </span>
        </div>

        {/* Product Badge/Tag */}
        <div className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-amber-50 border border-amber-200">
          <span className="text-amber-800 font-semibold text-sm lg:text-base">
            Professional Camera Equipment
          </span>
        </div>
      </div>
    </div>
  )
}
