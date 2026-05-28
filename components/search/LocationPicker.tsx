/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, {useState} from 'react'
import {ChevronDownIcon} from '@heroicons/react/24/outline'
import {IoLocationOutline} from 'react-icons/io5'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../app-store/session/session.slice'
import {locationCity} from '../../util/search.util'
import DeliverToModal from '../../app/components/redesign/DeliverToModal'

interface LocationPickerProps {
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

// Trigger button for the unified "Deliver to" picker. Visual chrome
// (theme/size) is preserved so legacy callers (MainHeaderNav, SubNavClient,
// HomeBanner, DynamicBrowseLink) keep their existing look; clicking opens
// DeliverToModal which handles Google Places search + supported-city gating.
export const LocationPicker: React.FC<LocationPickerProps> = ({
  theme = 'light',
  size = 'md',
}) => {
  const [open, setOpen] = useState(false)
  const stateSearch: any = useSelector(getDefaultSearch)
  const city = stateSearch?.location?.city

  const sizeStyles = (() => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-3 py-2',
          iconSize: 'w-5 h-5',
          chevronSize: 'w-4 h-4',
          textSize: 'text-sm',
          gap: 'gap-2',
        }
      case 'lg':
        return {
          padding: 'px-4 py-3',
          iconSize: 'w-5 h-5',
          chevronSize: 'w-5 h-5',
          textSize: 'text-base',
          gap: 'gap-2',
        }
      case 'md':
      default:
        return {
          padding: 'px-3 py-2',
          iconSize: 'w-4 h-4',
          chevronSize: 'w-4 h-4',
          textSize: 'text-sm',
          gap: 'gap-2',
        }
    }
  })()

  const themeStyles =
    theme === 'dark'
      ? {
          button: `${sizeStyles.padding} ${sizeStyles.gap} bg-gray-800 hover:bg-gray-700 border border-[#FDC002] rounded-full transition-all duration-200 flex items-center text-white font-medium`,
          text: `${sizeStyles.textSize} text-white flex-shrink-0`,
          icon: `${sizeStyles.iconSize} text-[#FDC002] flex-shrink-0`,
          chevron: `${sizeStyles.chevronSize} text-[#FDC002] flex-shrink-0`,
        }
      : {
          button: `${sizeStyles.padding} ${sizeStyles.gap} bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 flex items-center text-gray-900 font-medium`,
          text: `${sizeStyles.textSize} text-gray-900 flex-shrink-0`,
          icon: `${sizeStyles.iconSize} text-gray-600 flex-shrink-0`,
          chevron: `${sizeStyles.chevronSize} text-gray-600 flex-shrink-0`,
        }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change delivery location"
        className={`${themeStyles.button} focus:outline-none focus:ring-2 focus:ring-[#FDC002]/20`}
      >
        <IoLocationOutline className={themeStyles.icon} />
        <span className={themeStyles.text}>
          {city ? locationCity(city) : 'Select City'}
        </span>
        <ChevronDownIcon className={themeStyles.chevron} aria-hidden="true" />
      </button>
      <DeliverToModal
        open={open}
        onClose={() => setOpen(false)}
        currentCity={city ?? ''}
      />
    </>
  )
}
