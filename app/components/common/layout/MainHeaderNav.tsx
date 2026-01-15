/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'

import {selectAuthState} from 'app-store/auth/auth.slice'
import {useDispatch, useSelector} from 'react-redux'

import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React, {useEffect, useState} from 'react'

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
import {FaWhatsapp} from 'react-icons/fa'
import {getCitySlug} from '../../../../util/city.util'
import {LocationPicker} from '../../../../components/search/LocationPicker'

export default function MainHeaderNav() {
  const loggedUser = useSelector(selectAuthState)
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  const dispatch = useDispatch()
  const defaultSearch: any = useSelector<IDefaultSearch>(getDefaultSearch)

  const [location, setLocation] = useState<ISearchLocation>()

  const storeSearch = useSelector(getDefaultSearch)
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams?.get('q')
  const [searchText, setSearchText] = useState(q)
  const cart = useSelector(getCart)
  const searchProducts = () => {
    const city = getCitySlug(location?.city) || 'pune'
    router.push('/' + city + '?q=' + searchText)
  }

  const onSearch = (value: string) => {
    setSearchText(value)
  }

  const handleDateChange = (newDates: any) => {
    const updatedSearch = {
      ...storeSearch,
      dates: {
        startDate: newDates.selection.startDate.toString(),
        endDate: newDates.selection.endDate.toString(),
        key: 'selection',
      },
    }
    dispatch(setSearch(updatedSearch))
  }

  useEffect(() => {
    // Only fetch cart if user is logged in - guests don't have persisted carts
    if (!cart && loggedUser?.id) {
      fetchCart().then((o: IOrder) => {
        dispatch(setCart(o))
      }).catch(() => {
        // Silently fail - user might have no cart yet
      })
    }
    setLocation(storeSearch ? storeSearch.location : defaultSearch?.location)
  }, [cart, storeSearch, loggedUser])

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
                <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              {cart && cart.items && cart.items.length > 0 && (
                <Link
                  className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
                  href="/p/mycart"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-[#ffd910]" />

                  <span className="absolute -top-1 -right-1 bg-[#ffd910] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items?.length}
                  </span>
                </Link>
              )}
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
