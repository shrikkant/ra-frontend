import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React from 'react'
import {IProductSubCategory} from 'app-store/types'
import {fetchStaticData} from '../../../utils/api'
import SubNavClient from './SubNavClient'

// Categories nav data is public and identical for every visitor, so use
// the cookieless `fetchStaticData`. The auth-aware `fetchData` (which
// reads next/headers cookies) would taint the root layout, force every
// route dynamic, and disqualify the catch-all listing route from SSG.
export default async function HeaderSubNav() {
  const categories = await fetchStaticData('categories')
  const subCategories: IProductSubCategory[] = []

  const hiddenCategories: number[] = [59, 60, 62, 48, 50, 30]
  const subCats: IProductSubCategory[] =
    categories && categories[0].subCategories
      ? categories[0]?.subCategories?.filter((sc: IProductSubCategory) => {
          return sc.id && !hiddenCategories.includes(sc.id)
        })
      : []

  subCategories.push(...subCats)

  return <SubNavClient subCategories={subCategories} />
}
