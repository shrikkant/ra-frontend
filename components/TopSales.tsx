import React from 'react'
import {IProduct} from '../app-store/types'
import HomeProductCard from './home/HomeProductCard'
import SectionHeader from './common/SectionHeader'
import HorizontalScroller from './common/HorizontalScroller'
import ScrollerItem from './common/ScrollerItem'

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
        <SectionHeader
          title="Popular right now"
          subtitle="What creators are booking this week"
        />
        <HorizontalScroller desktopCols="md:grid-cols-4 lg:grid-cols-5">
          {products.map((product: IProduct) => (
            <ScrollerItem key={product.id} mobileWidth="w-[40vw]" snap="start">
              <HomeProductCard product={product} />
            </ScrollerItem>
          ))}
        </HorizontalScroller>
      </div>
    </section>
  )
}
