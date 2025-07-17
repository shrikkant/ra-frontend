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
    <div className="space-y-3 bg-white border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-medium text-gray-600 mb-3">
        Price Breakdown
      </h4>

      {/* Discounted Rate Display */}
      <div className=" rounded-md py-4  mb-4 ">
        <div className="flex items-center justify-between h-[36px] min-h-[36px] max-h-[36px] overflow-hidden">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900">
              {'₹' + discountedRate}
              <span className="text-sm text-gray-600 ml-2">per day</span>
            </div>
          </div>
          <div className="h-[36px] min-h-[36px] max-h-[36px] flex items-center">
            {finalDiscount > 0 && (
              <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2">
                <div className="text-sm text-green-800 font-semibold">
                  You save ₹{getSavings().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold">
              <PriceTag price={discountedRate} />
            </span>
            <span className="text-gray-500">×</span>
            <span className="text-gray-600">
              {getDays()} {getPlural('day', getDays())}
            </span>
          </div>
          <span className="text-gray-900 font-semibold">
            ₹{(discountedRate * getDays()).toLocaleString()}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{(discountedRate * getDays()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
