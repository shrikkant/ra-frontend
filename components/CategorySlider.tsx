import React from 'react'
import {CategorySliderItem} from './CategorySliderItem'
import {IProductSubCategory} from '../app-store/types'
import {fetchData} from '../app/utils/api.server'
import SectionHeader from './common/SectionHeader'
import HorizontalScroller from './common/HorizontalScroller'
import ScrollerItem from './common/ScrollerItem'

export const CategorySlider = async () => {
  const categories = await fetchData('categories')

  const hiddenCategories: number[] = [59, 60, 62, 48, 32, 50, 30]
  const subCategories: IProductSubCategory[] =
    categories && categories[0].subCategories
      ? categories[0].subCategories.filter((sc: IProductSubCategory) => {
          return sc.id && !hiddenCategories.includes(sc.id)
        })
      : []

  if (subCategories.length === 0) return null

  return (
    <section aria-label="Browse equipment by category" className="bg-white">
      <div className="max-w-7xl mx-auto py-10 sm:py-16 md:py-20">
        <SectionHeader
          title="Browse by category"
          trailing={<span className="text-sm text-gray-500 hidden sm:block">Explore all &rarr;</span>}
        />
        <HorizontalScroller desktopCols="md:grid-cols-3 lg:grid-cols-4">
          {subCategories.map(category => (
            <ScrollerItem key={category.id} mobileWidth="w-[55vw]" snap="center">
              <CategorySliderItem
                image={category.image_url}
                title={category.title}
                link={`/pune/${category.slug}`}
              />
            </ScrollerItem>
          ))}
        </HorizontalScroller>
      </div>
    </section>
  )
}
