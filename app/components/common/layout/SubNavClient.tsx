'use client'

import React, {useEffect, useState} from 'react'
import {Disclosure} from '@headlessui/react'
import {IProductSubCategory} from 'app-store/types'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {useSelector} from 'react-redux'
import {locationCity} from '../../../../util/search.util'

interface SubNavClientProps {
  subCategories: IProductSubCategory[]
}

export default function SubNavClient({subCategories}: SubNavClientProps) {
  const pathname = usePathname()
  const search = useSelector(getDefaultSearch)
  const [location, setLocation] = useState<any>(null)

  if (pathname === '/') {
    return null
  }

  useEffect(() => {
    const location: any = search?.location

    setLocation(location)
  }, [search])

  return (
    <Disclosure as="nav">
      <div className="container m-auto">
        <div className="relative flex flex-col sm:flex-row h-22 items-center justify-around border-gray-400">
          <div className="relative justify-center w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="inset-y-0 left-0 items-center sm:gap-x-6 flex overscroll-contain w-full overflow-x-auto relative">
              {location &&
                subCategories &&
                subCategories.map((cat: IProductSubCategory) => {
                  return (
                    <Link
                      key={cat.id}
                      className={
                        'whitespace-nowrap text-sm inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none'
                      }
                      href={`/${locationCity(location?.city, true)}/${cat.slug}`}
                    >
                      {cat.title}
                    </Link>
                  )
                })}
              <div className="ml-auto sm:mr-8">
                <a
                  href="/about-us"
                  className="whitespace-nowrap text-sm text-gray-100 hover:bg-gray-700 hover:text-yellow focus:outline-none"
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
