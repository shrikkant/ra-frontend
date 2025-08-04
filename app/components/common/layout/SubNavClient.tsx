'use client'

import React, {useEffect, useState} from 'react'
import {Disclosure} from '@headlessui/react'
import {IProductSubCategory} from 'app-store/types'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {useSelector} from 'react-redux'
import {locationCity} from '../../../../util/search.util'

interface SubNavClientProps {
  subCategories: IProductSubCategory[]
}

export default function SubNavClient({subCategories}: SubNavClientProps) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const search = useSelector(getDefaultSearch)
  const [location, setLocation] = useState<any>(null)

  useEffect(() => {
    const location: any = search?.location
    setLocation(location)
  }, [search])

  // Function to check if a subcategory is active
  const isActiveSubcategory = (slug: string) => {
    return pathSegments.length >= 2 && pathSegments[1] === slug
  }

  if (pathname === '/' || pathSegments.length > 2) {
    return null
  }

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 sticky top-14 sm:top-16 z-30"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center h-12">
          {/* Mobile: Horizontal scrolling categories */}
          <div className="flex items-center w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-x-1 sm:gap-x-2 min-w-max">
              {location &&
                subCategories &&
                subCategories.map((cat: IProductSubCategory) => {
                  const isActive = isActiveSubcategory(cat.slug)
                  return (
                    <Link
                      key={cat.id}
                      className={`whitespace-nowrap text-sm font-medium px-3 py-2 transition-all duration-200 ${
                        isActive
                          ? 'text-[#ffd910] bg-gray-600'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-[#ffd910]'
                      }`}
                      href={`/${locationCity(location?.city, true)}/${cat.slug}?q=`}
                    >
                      {cat.title}
                    </Link>
                  )
                })}
            </div>

            {/* About Us link - positioned at the end */}
            <div className="ml-auto pl-4 border-l border-gray-600">
              <Link
                href="/about-us"
                className="whitespace-nowrap text-sm font-medium px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-[#ffd910] transition-all duration-200"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Disclosure>
  )
}
