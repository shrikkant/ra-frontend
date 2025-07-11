import React from 'react'
import {CategorySliderItem} from './CategorySliderItem'
import {fetchData} from '../app/utils/api'
import {IProductSubCategory} from '../app-store/types'

export const CategorySlider = async () => {
  const categories = await fetchData('categories')
  const subCategories: IProductSubCategory[] = []

  const hiddenCategories: number[] = [59, 60, 62, 48, 32, 50, 30]
  const subCats: IProductSubCategory[] =
    categories && categories[0].subCategories
      ? categories[0]?.subCategories?.filter((sc: IProductSubCategory) => {
          return sc.id && !hiddenCategories.includes(sc.id)
        })
      : []

  subCategories.push(...subCats)

  return (
    <section className="py-12 relative overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(63, 63, 70, 0.05) 0%, rgba(63, 63, 70, 0.02) 30%, white 100%)',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {subCategories.map(category => (
            <CategorySliderItem
              image={category.image_url}
              key={category.id}
              title={category.title}
              link={`/pune/${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
