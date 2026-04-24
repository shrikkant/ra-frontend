import React from 'react'
import {IProduct} from '../../../../app-store/types'
import ProductTile from '../ProductTile'

interface PopularGridProps {
  products: IProduct[]
}

export default function PopularGrid({products}: PopularGridProps) {
  if (!products?.length) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 px-4 md:px-0">
      {products.map((p, i) => (
        <ProductTile key={p.id} product={p} featured={i === 0} />
      ))}
    </div>
  )
}
