import React from 'react'
import {CategorySliderItem} from './CategorySliderItem'
import {IProductSubCategory} from '../app-store/types'
import {fetchData} from '../app/utils/api'

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
        <div className="flex items-end justify-between mb-5 sm:mb-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Browse by category
          </h2>
          <span className="text-sm text-gray-400 hidden sm:block">Explore all &rarr;</span>
        </div>

        {/* Mobile: horizontal snap scroll · Desktop: grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 pl-4 pr-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:overflow-visible md:snap-none md:pb-0 md:px-6 lg:px-8">
          {subCategories.map(category => (
            <div
              key={category.id}
              className="flex-shrink-0 w-[55vw] sm:w-[40vw] snap-center md:w-auto"
            >
              <CategorySliderItem
                image={category.image_url}
                title={category.title}
                link={`/pune/${category.slug}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
