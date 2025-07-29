/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'

import {selectAuthState} from 'app-store/auth/auth.slice'
import {useDispatch, useSelector} from 'react-redux'

import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React, {useEffect, useState} from 'react'

import {Disclosure} from '@headlessui/react'
import {ShoppingCartIcon} from '@heroicons/react/24/outline'

import TopNavMenu from 'components/TopNavMenu'

import {getDefaultSearch} from 'app-store/session/session.slice'
import {fetchCart} from 'api/user/orders.api'
import {IDefaultSearch, ISearchLocation} from 'app-store/app-defaults/types'
import {getCart, setCart} from 'app-store/user/orders/orders.slice'
import {IOrder} from 'app-store/types'
import SearchBar from '../../../../components/SearchBar'
import {SearchInput} from '../../../../components/SearchInput'
import {FaHome, FaWhatsapp} from 'react-icons/fa'
import {getCitySlug} from '../../../../util/city.util'

export default function MainHeaderNav() {
  const loggedUser = useSelector(selectAuthState)
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

  useEffect(() => {
    if (loggedUser && !cart) {
      fetchCart().then((o: IOrder) => {
        dispatch(setCart(o))
      })
    }
    setLocation(storeSearch ? storeSearch.location : defaultSearch?.location)
  }, [cart, storeSearch])

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-lg"
    >
      <div className="px-3 sm:px-4 max-w-7xl mx-auto py-2">
        {/* Main header row */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}

          <div className="flex-shrink-0">
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
          {/* Desktop search bar - hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
            <div className="flex items-center gap-x-3 w-full">
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

              {loggedUser && (
                <Link
                  className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
                  href="/p/mycart"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-[#ffd910]" />
                  {cart && cart.items && cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffd910] text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items?.length}
                    </span>
                  )}
                </Link>
              )}
            </div>

            <TopNavMenu />
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="lg:hidden pb-3  border-gray-700">
          <div className="pt-3 space-y-3">
            <div className="flex items-center gap-x-2">
              <SearchBar />
            </div>
            <SearchInput
              currentVal={q || ''}
              onSearch={searchProducts}
              onChange={onSearch}
            />
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
