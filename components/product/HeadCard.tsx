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
          <div className="relative aspect-[4/3] w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-transparent">
            <img
              src={`/api/products/${product.master_product_id}/photo?width=800`}
              alt={product.title}
              className="object-contain w-full h-full transition-transform duration-300 hover:scale-10"
              width={800}
              height={600}
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Product Title and Location */}
      <div className="lg:text-left">
        <h1 className="text-md sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
          {product.title}
        </h1>

        <div className="flex items-start lg:justify-start text-gray-600 lg:mb-6">
          <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-1 text-gray-400" />
          <span className="text-sm lg:text-xl font-medium">
            {product.location.city}
          </span>
        </div>
      </div>
    </div>
  )
}
