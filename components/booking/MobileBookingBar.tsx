'use client'
import React from 'react'
import PriceTag from '../PriceTag'

interface MobileBookingBarProps {
  originalRate: number
  finalDiscount: number
  onBookNow: () => void
  showSignIn: boolean
  isLoading?: boolean
}

export const MobileBookingBar: React.FC<MobileBookingBarProps> = ({
  originalRate,
  finalDiscount,
  onBookNow,
  showSignIn,
  isLoading = false,
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white md:hidden border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-40 ${showSignIn ? 'hidden' : ''}`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-bold text-gray-900">
              <PriceTag price={originalRate} discount={finalDiscount} size="sm" />
            </div>
            <div className="text-xs text-gray-500 mt-0.5">per day</div>
          </div>
          <button
            onClick={onBookNow}
            disabled={isLoading}
            className="bg-[#FDC002] hover:bg-[#E5C71F] active:bg-[#f7ca00] text-gray-900 px-6 py-3 rounded-lg font-bold text-base whitespace-nowrap transition-all duration-200 shadow-md border border-[#E5C71F] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
