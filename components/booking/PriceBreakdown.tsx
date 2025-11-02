'use client'
import React from 'react'
import PriceTag from '../PriceTag'

interface PriceBreakdownProps {
  storeSearch: any
  discountedRate: number
  finalDiscount: number
  getDays: () => number
  getPlural: (text: string, days: number) => string
  getSavings: () => number
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  storeSearch,
  discountedRate,
  finalDiscount,
  getDays,
  getPlural,
  getSavings,
}) => {
  if (!storeSearch?.dates) return null

  return (
    <div className="space-y-3 bg-white  rounded-xl">
      <h4 className="text-sm font-medium text-gray-600 mb-3">
        Price Breakdown
      </h4>

      <div className="space-y-3">
        {/* Total Payment Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-md p-4">
          {/* Calculation Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">
                <PriceTag price={discountedRate} />
              </span>
              <span className="text-gray-400">×</span>
              <span className="text-gray-700 font-medium">
                {getDays()} {getPlural('day', getDays())}
              </span>
              {finalDiscount > 0 && (
                <span className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-md shadow-sm px-2 py-1 ml-2">
                  {finalDiscount}% OFF
                </span>
              )}
            </div>
            {finalDiscount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹
                {Math.round(
                  (discountedRate / (1 - finalDiscount / 100)) * getDays(),
                ).toLocaleString()}
              </span>
            )}
          </div>

          {/* You Pay Row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900">
                You Pay
              </span>
              {finalDiscount > 0 && (
                <span className="text-xs text-green-700 font-medium mt-0.5">
                  Save ₹{getSavings().toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-3xl font-bold text-gray-900">
              ₹{(discountedRate * getDays()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
