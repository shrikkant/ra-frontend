import React from 'react'
import {CheckCircleIcon} from '@heroicons/react/24/solid'

export interface Photo {
  path: string
}
export interface MasterProduct {
  id: number
  photos: Photo[]
  name: string
}

export interface Addon {
  masterProduct: MasterProduct
}
export interface ProductProps {
  addons: Addon[]
}

export const Package: React.FC<ProductProps> = ({addons}: ProductProps) => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            What's Included
          </h3>
        </div>
        <p className="text-gray-600 text-sm">
          Your rental package includes all the essential equipment
        </p>
      </div>

      {/* Compact Addons List */}
      <div className="space-y-2">
        {addons &&
          addons.map(addon => {
            if (!addon?.masterProduct?.id) {
              return null
            }
            return (
              <div
                key={addon?.masterProduct?.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Small Thumbnail */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    width={48}
                    height={48}
                    className="w-full h-full object-contain p-1"
                    alt={addon?.masterProduct.name}
                    src={`/api/products/${addon?.masterProduct?.id}/photo?width=48`}
                    loading="lazy"
                  />
                </div>

                {/* Product Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {addon?.masterProduct.name}
                  </p>
                </div>

                {/* Check Icon */}
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                </div>
              </div>
            )
          })}
      </div>

      {/* Compact Info Note */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          All equipment is professionally cleaned, tested, and ready for your
          shoot. Includes protective cases and basic accessories.
        </p>
      </div>
    </div>
  )
}
