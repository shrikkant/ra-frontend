import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React from 'react'
import {IProductSubCategory} from 'app-store/types'
import {fetchData} from '../../../utils/api'
import SubNavClient from './SubNavClient'

export default async function HeaderSubNav() {
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

  return <SubNavClient subCategories={subCategories} />
}
