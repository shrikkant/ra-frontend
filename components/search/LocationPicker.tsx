/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'
import {ChevronDownIcon} from '@heroicons/react/24/outline'
import {useDispatch, useSelector} from 'react-redux'
import {
  getDefaultSearch,
  setSearch,
} from '../../app-store/session/session.slice'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {locationCity} from '../../util/search.util'

const locations = [
  {
    value: 'Pune',
    label: 'Pune',
  },
  {
    value: 'Mumbai',
    label: 'Mumbai',
  },
  {
    value: 'bengaluru',
    label: 'Bangalore',
  },
]

export const LocationPicker = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [location, setLocation] = useState<any>(null)
  const stateSearch = useSelector(getDefaultSearch)

  const cityChange = city => {
    const search = {...stateSearch}
    search.location = {
      city,
    }

    window.location.href = '/' + locationCity(city, true)
  }

  useEffect(() => {
    const currentSearch = {...stateSearch}
    if (currentSearch && !currentSearch.location) {
      currentSearch.location = {
        city: 'Pune',
      }
      dispatch(setSearch(currentSearch))
    }

    const location: any = stateSearch?.location

    setLocation(location)
  }, [stateSearch])

  return (
    <Popover className="relative">
      <PopoverButton className="active:border-none focus:border-none focus:appearance-none inline-flex items-center gap-x-1 text-sm font-semibold leading-6 px-3 text-gray-100">
        <span>
          {location?.city ? locationCity(location.city) : 'Select City'}
        </span>
        <ChevronDownIcon
          className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel
          className="bg-white sm:absolute
          xs:fixed
          xs:left-6
          z-10 mt-5
          ml-5
          mr-5
          max-w-max
          sm:-translate-x-1/2 px-4 border
          rounded"
        >
          {({close}) => (
            <div className="py-2">
              {locations.map((loc, i) => (
                <Link
                  key={i}
                  href="#"
                  onClick={() => {
                    cityChange(loc.value)
                    close()
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
