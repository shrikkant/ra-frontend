import React from 'react'
import {IProduct} from '../../../../app-store/types'
import ProductTile from '../ProductTile'

interface AllGearGridProps {
  products: IProduct[]
}

export default function AllGearGrid({products}: AllGearGridProps) {
  if (!products?.length) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 px-4 md:px-0">
      {products.map(p => (
        <ProductTile key={p.id} product={p} />
      ))}
    </div>
  )
}
