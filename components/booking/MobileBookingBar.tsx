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
      className={`fixed bottom-0 left-0 right-0 bg-white md:hidden border-t border-gray-200 shadow-lg z-40 ${showSignIn ? 'hidden' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              <PriceTag price={originalRate} discount={finalDiscount} />
            </div>
            <div className="text-xs text-gray-600">per day</div>
          </div>
          <button
            onClick={onBookNow}
            disabled={isLoading}
            className="bg-[#FDC002] hover:bg-[#E5C71F] active:bg-[#f7ca00] text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-inner border-2 border-[#E5C71F] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
