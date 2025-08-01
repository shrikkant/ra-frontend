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
import {IoLocationOutline} from 'react-icons/io5'
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

interface LocationPickerProps {
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  theme = 'light',
  size = 'md',
}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [location, setLocation] = useState<any>(null)
  const stateSearch = useSelector(getDefaultSearch)

  const cityChange = city => {
    const search = {...stateSearch}
    search.location = {
      city,
    }
    dispatch(setSearch(search))
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

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-3 py-2',
          iconSize: 'w-5 h-5',
          chevronSize: 'w-4 h-4',
          textSize: 'text-sm',
          gap: 'gap-2',
        }
      case 'md':
        return {
          padding: 'px-3 py-2',
          iconSize: 'w-4 h-4',
          chevronSize: 'w-4 h-4',
          textSize: 'text-sm',
          gap: 'gap-2',
        }
      case 'lg':
      default:
        return {
          padding: 'px-4 py-3',
          iconSize: 'w-5 h-5',
          chevronSize: 'w-5 h-5',
          textSize: 'text-base',
          gap: 'gap-2',
        }
    }
  }

  // Theme-based styles
  const getThemeStyles = () => {
    const sizeStyles = getSizeStyles()

    if (theme === 'dark') {
      return {
        button: `${sizeStyles.padding} ${sizeStyles.gap} bg-gray-800 hover:bg-gray-700 border border-[#FDC002] rounded-full transition-all duration-200 flex items-center text-white font-medium`,
        text: `${sizeStyles.textSize} text-white`,
        icon: `${sizeStyles.iconSize} text-[#FDC002]`,
        chevron: `${sizeStyles.chevronSize} text-[#FDC002] transition-transform`,
        dropdown: 'bg-gray-800 border border-gray-600 shadow-xl rounded-lg',
        dropdownItem:
          'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-[#FDC002] transition-colors rounded-md mx-1',
      }
    }
    // Default light theme
    return {
      button: `${sizeStyles.padding} ${sizeStyles.gap} bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 flex items-center text-gray-900 font-medium`,
      text: `${sizeStyles.textSize} text-gray-900`,
      icon: `${sizeStyles.iconSize} text-gray-600`,
      chevron: `${sizeStyles.chevronSize} text-gray-600 transition-transform`,
      dropdown: 'bg-white border border-gray-200 shadow-lg rounded-lg',
      dropdownItem:
        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
    }
  }

  const styles = getThemeStyles()

  return (
    <Popover className="relative inline-block">
      {({open}) => (
        <>
          <PopoverButton
            className={`${styles.button} focus:outline-none focus:ring-2 focus:ring-[#FDC002]/20`}
          >
            <IoLocationOutline className={styles.icon} />
            <span className={styles.text}>
              {location?.city ? locationCity(location.city) : 'Select City'}
            </span>
            <ChevronDownIcon
              className={`${styles.chevron} ${open ? 'rotate-180' : ''}`}
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
              className={`absolute z-50 mt-2 w-56 ${styles.dropdown} py-2 left-0 transform`}
            >
              {({close}) => (
                <>
                  {locations.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        cityChange(loc.value)
                        close()
                      }}
                      className={`${styles.dropdownItem} w-full text-left`}
                    >
                      <span className="font-medium">{loc.label}</span>
                    </button>
                  ))}
                </>
              )}
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
