import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React from 'react'

import {Disclosure} from '@headlessui/react'
import {IProductSubCategory} from 'app-store/types'

import Link from 'next/link'
import {fetchData} from '../../../utils/api'

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

  return (
    <Disclosure as="nav" className="bg-gray-700 ">
      <div className="container m-auto">
        <div className="relative flex flex-col sm:flex-row h-22 items-center justify-around border-gray-400">
          <div className="relative justify-center w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 items-center sm:gap-x-6 flex overscroll-contain w-full overflow-x-auto relative">
              {subCategories &&
                subCategories.map((cat: IProductSubCategory) => {
                  return (
                    <Link
                      key={cat.id}
                      className={
                        'whitespace-nowrap text-sm inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none'
                      }
                      href={'/pune/' + cat.slug}
                    >
                      {cat.title}
                    </Link>
                  )
                })}
              {/* <div className="ml-auto sm:mr-8 md:mr-12"> */}
              <div className="ml-auto sm:mr-8">
                <a
                  href="/about-us"
                  className="whitespace-nowrap text-sm text-gray-100 hover:bg-gray-700 hover:text-yellow focus:outline-none "
                >
                  About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
