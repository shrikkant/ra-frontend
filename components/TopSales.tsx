import React from 'react'
import {IProduct} from '../app-store/types'
import HomeProductCard from './home/HomeProductCard'

interface IProductGroup {
  products: IProduct[]
}

export default function TopSales({categories}: {categories: IProductGroup[]}) {
  const products = [
    ...(categories?.[0]?.products ?? []),
    ...(categories?.[1]?.products ?? []),
  ]

  if (products.length === 0) return null

  return (
    <section aria-label="Popular rentals" className="bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto py-10 sm:py-16 md:py-20">
        <div className="px-4 sm:px-6 lg:px-8 mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Popular right now
          </h2>
          <p className="text-sm text-gray-400 mt-1 hidden sm:block">What creators are booking this week</p>
        </div>

        {/* Mobile: horizontal scroll · Desktop: grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 pl-4 pr-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-4 md:overflow-visible md:snap-none md:pb-0 md:px-6 lg:px-8">
          {products.map((product: IProduct) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[40vw] sm:w-[32vw] snap-start md:w-auto"
            >
              <HomeProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
