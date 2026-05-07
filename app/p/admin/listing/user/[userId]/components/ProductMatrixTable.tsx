import React from 'react'
import {MatrixData, Address} from '../types'
import ProductMatrixRow from './ProductMatrixRow'

interface ProductMatrixTableProps {
  matrixData: MatrixData
  onToggleFeatured: (productId: number, currentFeatured: number) => void
  onToggleMerchant: (productId: number, currentPushed: number) => void
  onToggleAddress: (productId: number, addressId: number, isActive: boolean) => void
  isToggling: (key: string) => boolean
}

function TableHeader({
  addresses,
  showMerchant,
}: {
  addresses: Address[]
  showMerchant: boolean
}) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r w-[400px] min-w-[400px]">
          Product
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
          Featured
        </th>
        {showMerchant && (
          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
            GMC
          </th>
        )}
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
          Rate
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
          Status
        </th>
        {addresses.map(address => (
          <th
            key={address.id}
            className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[120px]"
            title={address.display || address.landmark}
          >
            <div>{address.city}</div>
            <div className="text-[10px] font-normal normal-case truncate max-w-[100px]">
              {address.id}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default function ProductMatrixTable({
  matrixData,
  onToggleFeatured,
  onToggleMerchant,
  onToggleAddress,
  isToggling,
}: ProductMatrixTableProps) {
  const allAddresses = matrixData.cities.flatMap(city => city.addresses)
  const showMerchant = !!matrixData.merchantCenterEnabled

  if (matrixData.products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products found for this user
      </div>
    )
  }

  if (matrixData.cities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No addresses found for this user. Add addresses first.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200">
        <TableHeader addresses={allAddresses} showMerchant={showMerchant} />
        <tbody className="bg-white divide-y divide-gray-200">
          {matrixData.products.map(product => (
            <ProductMatrixRow
              key={product.id}
              product={product}
              addresses={allAddresses}
              showMerchant={showMerchant}
              onToggleFeatured={onToggleFeatured}
              onToggleMerchant={onToggleMerchant}
              onToggleAddress={onToggleAddress}
              isToggling={isToggling}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
