/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {useRouter, useSearchParams} from 'next/navigation'

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
    <Disclosure as="nav">
      <div className="px-4 md:px-4 max-w-7xl mx-auto py-2">
        <div className="relative flex flex-col sm:flex-row h-28 sm:h-16 items-center justify-around border-gray-400">
          <div className="justify-between w-full inset-y-0 right-0 flex items-center sm:static sm:inset-auto">
            <div className=" inset-y-0 left-0 flex items-center sm:gap-x-6 ">
              <div className="my-4 justify-center ">
                <a href="/">
                  <img
                    className="hidden lg:block h-6"
                    src="/assets/v2/img/logo.png"
                    alt="RentAcross"
                  />
                  <FaHome className="block lg:hidden h-6 w-6 text-amber-500" />
                </a>
              </div>

              <SearchBar></SearchBar>
              <div className="hidden sm:block">
                <SearchInput
                  currentVal={q || ''}
                  onSearch={searchProducts}
                  onChange={onSearch}
                ></SearchInput>
              </div>
            </div>
            <div className="flex items-center gap-x-2 md:px-2 lg:gap-x-4">
              {loggedUser && (
                <div className="flex items-center gap-x-2 lg:gap-x-4 text-green-500">
                  <a
                    href="https://wa.me/7720829444?text=Hello%20I%20need%20support"
                    target="_blank"
                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow-lg flex items-center justify-center"
                    rel="noreferrer"
                  >
                    <FaWhatsapp className="h-6 w-6" />
                  </a>
                  <a
                    className="relative    hover:text-gray-600 p-0 rounded-md tex-sm font-semibold text-gray-600 content-center"
                    href="/p/mycart"
                  >
                    <ShoppingCartIcon className="h-8 w-8" />
                    {cart && cart.items && cart.items.length > 0 && (
                      <span
                        className="absolute text-white right-0 top-0 rounded-full bg-red-600 w-4 h-4 font-sans text-xs top right p-0 flex justify-center items-center"
                        style={{
                          top: '-4px',
                          right: '-4px',
                        }}
                      >
                        {cart.items?.length}
                      </span>
                    )}
                  </a>
                </div>
              )}

              <TopNavMenu />
            </div>
          </div>

          <div className="flex justify-center gap-x-5 w-full sm:hidden">
            <SearchInput
              currentVal={q}
              onSearch={searchProducts}
              onChange={onSearch}
            ></SearchInput>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
