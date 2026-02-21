import React from 'react'
import {dateDisplay} from '../../util/date.util'

export function EarlyDeliveryBanner({startDate}: {startDate: Date}) {
  const earlyDate = new Date(new Date(startDate).getTime() - 24 * 60 * 60 * 1000)

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-4 mt-5">
      <div className="flex items-start gap-2 mb-2">
        <svg
          className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-bold text-green-800">You get it a day early!</p>
          <p className="text-xs text-green-700 mt-1">
            Delivery on {dateDisplay(earlyDate)}
          </p>
        </div>
      </div>
    </div>
  )
}
