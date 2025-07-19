'use client'
import React, {useState, useEffect} from 'react'
import {DateRange} from 'react-date-range'
import {IoCalendarOutline, IoChevronDown} from 'react-icons/io5'
import 'react-date-range/dist/styles.css'
import {getDays, getPlural} from './bookingUtils'

interface DateSelectorProps {
  storeSearch: any
  onDateChange: (dates: any) => void
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  storeSearch,
  onDateChange,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [localDates, setLocalDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  // Sync local dates with store dates
  useEffect(() => {
    if (storeSearch?.dates) {
      setLocalDates({
        startDate: new Date(storeSearch.dates.startDate),
        endDate: new Date(storeSearch.dates.endDate),
        key: 'selection',
      })
    }
  }, [storeSearch?.dates])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const setBookingDates = (newDates: any) => {
    onDateChange(newDates)
    setLocalDates(newDates)
  }

  const onRangeFocusChange = (focusedRange: any) => {
    // Close calendar when both dates are selected (focusedRange is [0, 0])
    if (
      focusedRange &&
      focusedRange.length === 2 &&
      focusedRange[0] === 0 &&
      focusedRange[1] === 0
    ) {
      setIsDatePickerOpen(false)
    }
  }

  const hasDates = !!storeSearch?.dates

  return (
    <div className="relative">
      <div
        className={`border-2 border-[#FDC002] rounded-lg p-4 bg-white hover:border-[#E5C71F] hover:bg-[#FDC002]/5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4`}
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 flex-1">
          <IoCalendarOutline className="w-5 h-5 text-[#FDC002] flex-shrink-0" />
          <div className="flex items-center gap-6 w-full">
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 font-medium mb-1">
                Start
              </span>
              <span className="text-base text-gray-900 font-semibold truncate">
                {hasDates
                  ? formatDate((storeSearch?.dates?.startDate ?? '').toString())
                  : 'Select date'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 font-medium mb-1">
                End
              </span>
              <span className="text-base text-gray-900 font-semibold truncate">
                {hasDates
                  ? formatDate((storeSearch?.dates?.endDate ?? '').toString())
                  : 'Select date'}
              </span>
            </div>
            {hasDates && (
              <div className="flex flex-col justify-center items-center ml-auto">
                <span className="text-md text-[#FDC002] font-semibold whitespace-nowrap">
                  {getDays(storeSearch)}{' '}
                  {getPlural('day', getDays(storeSearch))}
                </span>
              </div>
            )}
          </div>
        </div>
        <IoChevronDown className="w-5 h-5 text-[#FDC002] flex-shrink-0" />
      </div>

      {/* Calendar that opens directly */}
      {isDatePickerOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200">
          <div>
            <DateRange
              startDatePlaceholder="Starting"
              endDatePlaceholder="Ending"
              minDate={new Date()}
              onChange={setBookingDates}
              moveRangeOnFirstSelection={false}
              ranges={[localDates]}
              rangeColors={['#FDC002']}
              color="#FDC002"
              onRangeFocusChange={onRangeFocusChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}
