'use client'
import React, {useState, useEffect, useRef} from 'react'
import {DateRange} from 'react-date-range'
import {IoCalendarOutline, IoChevronDown} from 'react-icons/io5'
import 'react-date-range/dist/styles.css'
import {getDays, getPlural} from './bookingUtils'

// Utility function to get minimum booking date based on current time
export const getMinBookingDate = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // If time is less than 11:30 AM, allow today
  if (currentHour < 11 || (currentHour === 11 && currentMinute < 30)) {
    return new Date()
  } else {
    // If time is 11:30 AM or later, set min date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }
}

interface DateSelectorProps {
  storeSearch: any
  onDateChange: (dates: any) => void
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  storeSearch,
  onDateChange,
  theme = 'light',
  size = 'lg',
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [localDates, setLocalDates] = useState(() => {
    const minDate = getMinBookingDate()

    return {
      startDate: minDate,
      endDate: minDate,
      key: 'selection',
    }
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Function to get minimum date based on current time
  const getMinDate = () => {
    return getMinBookingDate()
  }

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

  // Add mobile styles for date picker
  useEffect(() => {
    if (size === 'sm' && isDatePickerOpen) {
      const style = document.createElement('style')
      style.textContent = `
        /* Main wrapper classes */
        .rdrCalendarWrapper,
        .rdrDateRangeWrapper,
        .rdrDateRangePickerWrapper {
          width: 100% !important;
        }

        /* Months container */
        .rdrMonths,
        .rdrMonthsVertical {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }

        /* Individual month */
        .rdrMonth {
          width: 100% !important;
          max-width: 320px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        /* Week days header */
        .rdrWeekDays {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }

        /* Days grid */
        .rdrDays {
          width: 100% !important;
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
        }

        /* Individual day buttons */
        .rdrDay {
          flex: 0 0 14.28% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [size, isDatePickerOpen])

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isDatePickerOpen
      ) {
        setIsDatePickerOpen(false)
      }
    }

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDatePickerOpen])

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

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'p-2',
          gap: 'gap-2',
          iconSize: 'w-4 h-4',
          labelText: 'text-xs font-medium mb-0.5',
          valueText: 'text-sm font-medium truncate',
          daysText: 'text-sm font-semibold whitespace-nowrap',
          itemGap: 'gap-4',
          flexDirection: 'flex-row',
        }
      case 'md':
        return {
          padding: 'p-3',
          gap: 'gap-3',
          iconSize: 'w-5 h-5',
          labelText: 'text-xs font-medium mb-1',
          valueText: 'text-sm font-semibold truncate',
          daysText: 'text-sm font-semibold whitespace-nowrap',
          itemGap: 'gap-4',
          flexDirection: 'flex-row',
        }
      case 'lg':
      default:
        return {
          padding: 'p-4',
          gap: 'gap-4',
          iconSize: 'w-5 h-5',
          labelText: 'text-xs font-medium mb-1',
          valueText: 'text-base font-semibold truncate',
          daysText: 'text-md font-semibold whitespace-nowrap',
          itemGap: 'gap-6',
          flexDirection: 'flex-row',
        }
    }
  }

  // Theme-based styles
  const getThemeStyles = () => {
    const sizeStyles = getSizeStyles()
    const baseClasses = `border-2 border-[#FDC002] rounded-lg ${sizeStyles.padding} hover:border-[#E5C71F] transition-all duration-300 cursor-pointer flex items-center justify-between ${sizeStyles.gap}`

    if (theme === 'dark') {
      return {
        container: `${baseClasses} bg-gray-800 hover:bg-gray-700`,
        labelText: `${sizeStyles.labelText} text-gray-300`,
        valueText: `${sizeStyles.valueText} text-white`,
        placeholderText: `${sizeStyles.valueText} text-gray-400`,
        icon: `${sizeStyles.iconSize} text-[#FDC002] flex-shrink-0`,
        chevron: `${sizeStyles.iconSize} text-[#FDC002] flex-shrink-0`,
        daysText: `${sizeStyles.daysText} text-[#FDC002]`,
        itemGap: sizeStyles.itemGap,
        flexDirection: sizeStyles.flexDirection,
      }
    }
    // Default light theme
    return {
      container: `${baseClasses} bg-white hover:bg-[#FDC002]/5`,
      labelText: `${sizeStyles.labelText} text-gray-500`,
      valueText: `${sizeStyles.valueText} text-gray-900`,
      placeholderText: `${sizeStyles.valueText} text-gray-900`,
      icon: `${sizeStyles.iconSize} text-[#FDC002] flex-shrink-0`,
      chevron: `${sizeStyles.iconSize} text-[#FDC002] flex-shrink-0`,
      daysText: `${sizeStyles.daysText} text-[#FDC002]`,
      itemGap: sizeStyles.itemGap,
      flexDirection: sizeStyles.flexDirection,
    }
  }

  const styles = getThemeStyles()

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={styles.container}
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 flex-1">
          <IoCalendarOutline className={styles.icon} />
          <div className={`flex items-center ${styles.itemGap} w-full`}>
            <div className="flex flex-col min-w-0">
              {size !== 'sm' && <span className={styles.labelText}>Start</span>}
              <span
                className={hasDates ? styles.valueText : styles.placeholderText}
              >
                {hasDates
                  ? formatDate((storeSearch?.dates?.startDate ?? '').toString())
                  : 'Select date'}
              </span>
            </div>
            {size === 'sm' && (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  →
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              {size !== 'sm' && <span className={styles.labelText}>End</span>}
              <span
                className={hasDates ? styles.valueText : styles.placeholderText}
              >
                {hasDates
                  ? formatDate((storeSearch?.dates?.endDate ?? '').toString())
                  : 'Select date'}
              </span>
            </div>
            {hasDates && size !== 'sm' && (
              <div className="flex flex-col justify-center items-center ml-auto">
                <span className={styles.daysText}>
                  {getDays(storeSearch)}{' '}
                  {getPlural('day', getDays(storeSearch))}
                </span>
              </div>
            )}
            {hasDates && size === 'sm' && (
              <div className="flex items-center ml-auto">
                <span className={styles.daysText}>
                  {getDays(storeSearch)}{' '}
                  {getPlural('day', getDays(storeSearch))}
                </span>
              </div>
            )}
          </div>
        </div>
        <IoChevronDown
          className={`${styles.chevron} transition-transform ${
            isDatePickerOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Calendar that opens directly */}
      {isDatePickerOpen && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 ${
            size === 'sm' ? 'left-0 right-0 w-full' : 'left-0 right-0'
          }`}
        >
          <div
            className={`flex justify-center ${size === 'sm' ? 'w-full' : ''}`}
          >
            <DateRange
              startDatePlaceholder="Starting"
              endDatePlaceholder="Ending"
              minDate={getMinDate()}
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
