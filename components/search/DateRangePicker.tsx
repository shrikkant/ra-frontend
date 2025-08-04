/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react'
import {rangeDisplay} from 'util/date.util'
import {Fragment, useEffect, useState, useRef} from 'react'
import {ChevronDownIcon} from '@heroicons/react/24/outline'
import {DateRange} from 'react-date-range'
import {useDispatch, useSelector} from 'react-redux'
import {
  getDefaultSearch,
  setSearch,
} from '../../app-store/session/session.slice'
import {IDates} from '../../app-store/app-defaults/types'
import {createPortal} from 'react-dom'

import 'react-date-range/dist/styles.css' // main style file
import {DateSelector, getMinBookingDate} from '../booking/DateSelector'

export const DateRangePicker = ({mode}: {mode: string}) => {
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({top: 0, left: 0})
  const [isOpen, setIsOpen] = useState(false)

  const storeSearch = useSelector(getDefaultSearch)
  const [dates, setDates] = useState<IDates>()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const currentSearch: any = {...storeSearch}

    if (!currentSearch.dates) {
      const minDate = getMinBookingDate()
      const twoWeeksLater = new Date(minDate)
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)
      const currentDates = {
        startDate: '' + minDate,
        endDate: '' + twoWeeksLater,
        key: 'selection',
      }
      currentSearch.dates = currentDates

      dispatch(setSearch(currentSearch))
    }

    if (currentSearch && currentSearch.dates) {
      const currentDates = {
        startDate: new Date(currentSearch.dates.startDate),
        endDate: new Date(currentSearch.dates.endDate),
        key: 'selection',
      }

      setDates(currentDates)
    }
  }, [storeSearch])

  const setBookingDates = dates => {
    console.log('dates', dates)
    const search: any = {...storeSearch}
    search.dates = {
      startDate: '' + dates.selection.startDate,
      endDate: '' + dates.selection.endDate,
      key: 'selection',
    }
    dispatch(setSearch(search))
  }

  const onRangePick = (d, done) => {
    if (d.filter(a => a === 0).length === 2) {
      done()
    }
  }

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const pickerWidth = 300 // Approximate width of the date picker

      // Calculate if there's enough space on the right
      const spaceOnRight = windowWidth - rect.left
      const spaceOnLeft = rect.left

      let left = rect.left + window.scrollX

      // If there isn't enough space on either side, center it below the button
      if (spaceOnRight < pickerWidth / 2 || spaceOnLeft < pickerWidth / 2) {
        left = rect.left + rect.width / 2 - pickerWidth / 2 + window.scrollX
      }

      // Adjust left position for mobile screens
      if (windowWidth < 640) {
        // sm breakpoint
        left = 16 // 16px from left on mobile
      }

      setPosition({
        top: rect.bottom + window.scrollY,
        left: Math.max(16, Math.min(left, windowWidth - pickerWidth - 16)), // Keep within viewport with padding
      })
    }
  }

  const textColor = mode === 'dark' ? 'text-gray-700' : 'text-gray-100'

  return (
    <div className="min-w-[270px]">
      <DateSelector
        storeSearch={storeSearch}
        size="sm"
        onDateChange={setBookingDates}
        theme="dark"
      />
    </div>
  )
}
