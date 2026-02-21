import React from 'react'
import {IoCalendarOutline} from 'react-icons/io5'
import {dateDisplay} from '../../util/date.util'

export function RentalPeriodCard({
  startDate,
  endDate,
  days,
}: {
  startDate: Date | undefined
  endDate: Date | undefined
  days: number
}) {
  return (
    <div className="border-2 border-[#FDC002] rounded-lg p-4 bg-white hover:bg-[#FDC002]/5 transition-all duration-300 mt-4">
      <div className="flex items-center gap-3">
        <IoCalendarOutline className="w-5 h-5 text-[#FDC002] flex-shrink-0" />
        <div className="flex items-center gap-6 w-full">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium mb-1 text-gray-500">Rental Start</span>
            <span className="text-base font-semibold truncate text-gray-900">
              {dateDisplay(startDate)}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium mb-1 text-gray-500">Rental End</span>
            <span className="text-base font-semibold truncate text-gray-900">
              {dateDisplay(endDate)}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center ml-auto">
            <span className="text-md font-semibold whitespace-nowrap text-[#FDC002]">
              {days} {days === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
