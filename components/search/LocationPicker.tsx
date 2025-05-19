/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Menu,
} from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'

import {useDispatch, useSelector} from 'react-redux'
import {
  getDefaultSearch,
  setSearch,
} from '../../app-store/session/session.slice'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

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

    window.location.href = '/' + locationCity(city).toLowerCase()
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

  const locationCity = city => {
    const cityName = city.toLowerCase() === 'bengaluru' ? 'Bangalore' : city
    return cityName.slice(0, 1).toUpperCase() + cityName.slice(1)
  }

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton className="w-20 p-0  rounded-full bg-gray-800 text-sm focus:outline-none  focus:ring-white focus:ring-offset-gray-800 profileref">
          <div className="flex w-full justify-end">
            {location?.city ? (
              <span className=" text-gray-100 font-semibold">
                {locationCity(location.city)}
              </span>
            ) : (
              <span>{'Select City'}</span>
            )}
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </div>
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="mt-2 absolute truncate top-full right-0 w-28 bg-white border rounded-md shadow-lg z-50">
            {locations &&
              locations.map((loc, i) => {
                // const icon = "bg-[url(/assets/img/city_images/" + loc.label + ".png)]";

                return (
                  <MenuItem key={i}>
                    <Link
                      href={'#'}
                      type="button"
                      onClick={() => {
                        cityChange(loc.value)
                        close()
                      }}
                      className="flex gap-x-2 w-full text-left px-4 py-3 text-gray-800 bg-gray-100 justify-start items-center"
                    >
                      {loc.label}
                    </Link>
                  </MenuItem>
                )
              })}
          </MenuItems>
        </Transition>
      </Menu>
    </>
  )
}
