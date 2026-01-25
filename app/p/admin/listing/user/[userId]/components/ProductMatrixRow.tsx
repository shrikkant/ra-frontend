import React from 'react'
import {Product, Address, STATUS_LABELS} from '../types'
import ToggleButton from './ToggleButton'

interface ProductMatrixRowProps {
  product: Product
  addresses: Address[]
  onToggleFeatured: (productId: number, currentFeatured: number) => void
  onToggleAddress: (productId: number, addressId: number, isActive: boolean) => void
  isToggling: (key: string) => boolean
}

export default function ProductMatrixRow({
  product,
  addresses,
  onToggleFeatured,
  onToggleAddress,
  isToggling,
}: ProductMatrixRowProps) {
  const isAddressLinked = (addressId: number) => !!product.addressLinks[addressId]

  return (
    <tr className="hover:bg-gray-50">
      {/* Product Info */}
      <td className="sticky left-0 bg-white px-4 py-3 border-r w-[400px] min-w-[400px]">
        <div className="text-sm font-medium text-gray-900">{product.title}</div>
        {product.masterProductName && (
          <div className="text-xs text-gray-500">{product.masterProductName}</div>
        )}
        <div className="text-xs text-gray-400">ID: {product.id}</div>
      </td>

      {/* Featured Toggle */}
      <td className="px-4 py-3 border-r text-center">
        <div className="flex justify-center">
          <ToggleButton
            isActive={!!product.featured}
            isLoading={isToggling(`featured-${product.id}`)}
            onClick={() => onToggleFeatured(product.id, product.featured)}
            activeColor="bg-yellow-400 hover:bg-yellow-500"
            icon="star"
            title={product.featured ? 'Remove from featured' : 'Mark as featured'}
          />
        </div>
      </td>

      {/* Rate */}
      <td className="px-4 py-3 border-r text-sm text-gray-500">
        {product.rate ? `₹${product.rate}` : '-'}
      </td>

      {/* Status */}
      <td className="px-4 py-3 border-r">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            STATUS_LABELS[product.status]?.color || 'bg-gray-100 text-gray-800'
          }`}
        >
          {STATUS_LABELS[product.status]?.label || 'Unknown'}
        </span>
      </td>

      {/* Address Toggles */}
      {addresses.map(address => {
        const isLinked = isAddressLinked(address.id)
        return (
          <td key={address.id} className="px-4 py-3 text-center border-r">
            <div className="flex justify-center">
              <ToggleButton
                isActive={isLinked}
                isLoading={isToggling(`address-${product.id}-${address.id}`)}
                onClick={() => onToggleAddress(product.id, address.id, isLinked)}
                title={isLinked ? 'Click to disable' : 'Click to enable'}
              />
            </div>
          </td>
        )
      })}
    </tr>
  )
}
