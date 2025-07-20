import React from 'react'

import PageContainer from './common/PageContainer'
import {IProduct} from '../app-store/types'
import ProductCard from './ProductCard'

interface IProductGroup {
  products: IProduct[]
}

export default function TopSales({categories}: {categories: IProductGroup[]}) {
  return (
    <div className="xs:px-2 sm:px-4 max-w-7xl mx-auto">
      <section className="py-24 relative z-10 text-center">
        <h2 className="title">Top sales</h2>
        {categories && (
          <div className=" product-cover grid md:grid-cols-4 gap-2 md:gap-4 lg:grid-cols-5 xs:grid-cols-2">
            {categories[0]?.products?.map((product: IProduct) => (
              <ProductCard key={product.id} product={product}></ProductCard>
            ))}

            {categories[1]?.products?.map((product: IProduct) => (
              <ProductCard key={product.id} product={product}></ProductCard>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
