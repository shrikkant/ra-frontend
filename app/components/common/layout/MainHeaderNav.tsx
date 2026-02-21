/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'

import {selectAuthState} from 'app-store/auth/auth.slice'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'

import React, {useCallback, useEffect, useRef, useState} from 'react'

import {Disclosure} from '@headlessui/react'
import {ShoppingCartIcon} from '@heroicons/react/24/outline'

import TopNavMenu from 'components/TopNavMenu'

import {getDefaultSearch, setSearch} from 'app-store/session/session.slice'
import {fetchCart} from 'api/user/orders.api'
import {IDefaultSearch, ISearchLocation} from 'app-store/app-defaults/types'
import {getCart, setCart} from 'app-store/user/orders/orders.slice'
import {IOrder} from 'app-store/types'
import SearchBar from '../../../../components/SearchBar'
import {SearchInput} from '../../../../components/SearchInput'
import {DateSelector} from '../../../../components/booking/DateSelector'
import {getCitySlug} from '../../../../util/city.util'
import {LocationPicker} from '../../../../components/search/LocationPicker'

// Inline WhatsApp SVG to avoid loading react-icons/fa in header
const WhatsAppIcon = ({className}: {className?: string}) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
)

// Separated cart badge to prevent re-renders of entire header
const CartBadge = React.memo(function CartBadge() {
  const cart = useSelector(getCart, shallowEqual)

  if (!cart?.items?.length) return null

  return (
    <Link
      className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
      href="/p/mycart"
      aria-label="Shopping Cart"
    >
      <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-[#ffd910]" />
      <span className="absolute -top-1 -right-1 bg-[#ffd910] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {cart.items.length}
      </span>
    </Link>
  )
})

export default function MainHeaderNav() {
  const loggedUser = useSelector(selectAuthState, shallowEqual)
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  const dispatch = useDispatch()
  const defaultSearch: any = useSelector<IDefaultSearch>(getDefaultSearch, shallowEqual)

  const [location, setLocation] = useState<ISearchLocation>()

  const storeSearch = useSelector(getDefaultSearch, shallowEqual)
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams?.get('q')
  const [searchText, setSearchText] = useState(q)
  const cartFetchedRef = useRef(false)

  const searchProducts = useCallback(() => {
    const city = getCitySlug(location?.city) || 'pune'
    router.push('/' + city + '?q=' + searchText)
  }, [location?.city, searchText, router])

  const onSearch = useCallback((value: string) => {
    setSearchText(value)
  }, [])

  const handleDateChange = useCallback((newDates: any) => {
    const updatedSearch = {
      ...storeSearch,
      dates: {
        startDate: newDates.selection.startDate.toString(),
        endDate: newDates.selection.endDate.toString(),
        key: 'selection',
      },
    }
    dispatch(setSearch(updatedSearch))
  }, [storeSearch, dispatch])

  useEffect(() => {
    // Only fetch cart once per session if user is logged in
    if (!cartFetchedRef.current && loggedUser?.id) {
      cartFetchedRef.current = true
      fetchCart().then((o: IOrder) => {
        dispatch(setCart(o))
      }).catch(() => {
        // Silently fail - user might have no cart yet
      })
    }
    setLocation(storeSearch ? storeSearch.location : defaultSearch?.location)
  }, [storeSearch, loggedUser])

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-lg"
    >
      <div className="px-4 sm:px-4 max-w-7xl mx-auto ">
        {/* Main header row */}
        <div className="flex items-center justify-between h-16 sm:h-16 py-2">
          <div className="flex-shrink-0 sm:hidden flex justify-center items-center gap-x-4 ">
            <Link href="/" className="flex items-center">
              <div className="sm:hidden bg-gradient-to-r from-[#ffd910] to-amber-400 rounded-full shadow-md">
                <img
                  className=" sm:block  h-8 w-8"
                  src="/assets/v2/img/logo-sq.png"
                  alt="RentAcross"
                />
              </div>
            </Link>
            <div>
              <LocationPicker theme="dark" size="sm" />
            </div>
          </div>
          <div className="hidden sm:flex flex-1 max-w-full mx-6 gap-x-4">
            <div className="flex-shrink-0 justify-center items-center flex">
              <Link href="/" className="flex items-center">
                <img
                  className="hidden sm:block h-7 lg:h-8"
                  src="/assets/v2/img/logo.png"
                  alt="RentAcross"
                />
                <div className="sm:hidden bg-gradient-to-r from-[#ffd910] to-amber-400 p-2 rounded-lg shadow-md">
                  <img
                    className=" sm:block  h-4"
                    src="/assets/v2/img/logo.png"
                    alt="RentAcross"
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-x-3 sm:ml-4">
              <SearchBar />

              <SearchInput
                currentVal={q || ''}
                onSearch={searchProducts}
                onChange={onSearch}
              />
            </div>
          </div>
          {/* Right side actions */}
          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-x-2">
              <Link
                href="https://wa.me/7720829444?text=Hello%20I%20need%20support"
                target="_blank"
                className="bg-green-500 hover:bg-green-600 text-white h-8 w-8 items-center justify-center flex rounded-full shadow-md transition-all duration-200 hover:scale-105"
                rel="noreferrer"
                aria-label="WhatsApp Support"
              >
                <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <CartBadge />
            </div>

            <TopNavMenu />
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="lg:hidden border-t border-gray-700">
          <div className="pt-3">
            <div className="mb-3">
              <DateSelector
                storeSearch={storeSearch}
                size="sm"
                onDateChange={handleDateChange}
                theme="dark"
              />
            </div>
            {pathname !== '/' && pathSegments.length < 3 && (
              <SearchInput
                currentVal={q || ''}
                onSearch={searchProducts}
                onChange={onSearch}
              />
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
