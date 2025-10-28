'use client'
import React from 'react'
import Button from '../common/form/Button'
import {DateSelector} from './DateSelector'
import {PriceBreakdown} from './PriceBreakdown'
import {TrustIndicators} from './TrustIndicators'

interface BookingFormContentProps {
  storeSearch: any
  onDateChange: (dates: any) => void
  onBookNow: () => void
  discountedRate: number
  finalDiscount: number
  getDays: () => number
  getPlural: (text: string, days: number) => string
  getSavings: () => number
}

export const BookingFormContent: React.FC<BookingFormContentProps> = ({
  storeSearch,
  onDateChange,
  onBookNow,
  discountedRate,
  finalDiscount,
  getDays,
  getPlural,
  getSavings,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Date Selector */}
      <DateSelector storeSearch={storeSearch} onDateChange={onDateChange} />

      {/* Price Breakdown */}
      <PriceBreakdown
        storeSearch={storeSearch}
        discountedRate={discountedRate}
        finalDiscount={finalDiscount}
        getDays={getDays}
        getPlural={getPlural}
        getSavings={getSavings}
      />
      {/* Book Now Button */}
      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={onBookNow}
          label={storeSearch?.dates ? 'Book Now' : 'Select dates to continue'}
          disabled={!storeSearch?.dates}
        />

        {!storeSearch?.dates && (
          <p className="text-center text-sm text-gray-500">
            You won&apos;t be charged until you confirm your booking
          </p>
        )}
      </div>

      {/* Trust Indicators */}
      <TrustIndicators />
    </div>
  )
}
