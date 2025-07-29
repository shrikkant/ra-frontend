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

  useEffect(() => {
    const location: any = search?.location
    setLocation(location)
  }, [search])

  if (pathname === '/') {
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
                  return (
                    <Link
                      key={cat.id}
                      className="whitespace-nowrap text-sm font-medium px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-[#ffd910] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffd910] focus:ring-offset-2 focus:ring-offset-gray-800"
                      href={`/${locationCity(location?.city, true)}/${cat.slug}`}
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
                className="whitespace-nowrap text-sm font-medium px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-[#ffd910] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffd910] focus:ring-offset-2 focus:ring-offset-gray-800"
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
