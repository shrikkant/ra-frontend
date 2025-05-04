import ProductCard from './ProductCard'
import React from 'react'
import {IProduct} from '../app-store/types'

interface CategoryRowProps {
  category: {
    products: IProduct[]
  }
}

export default function CategoryRow(props: CategoryRowProps) {
  return (
    <div className="r-comp flex  sm:gap-4 flex-wrap p-2">
      {props.category.products.map((product: IProduct) => (
        <ProductCard key={product.id} product={product}></ProductCard>
      ))}
    </div>
  )
}
