import React from 'react'
import {ORDER_STEPS} from 'config/constants'
import Button from 'components/common/form/Button'

function getCtaLabel(step: number): string {
  switch (step) {
    case ORDER_STEPS.ORDER_STEP_DELIVERY:
      return 'Select Address'
    case ORDER_STEPS.ORDER_STEP_PAYMENT:
      return 'Place Your Order'
    default:
      return 'Continue'
  }
}

export function StickyMobileCta({
  currentStep,
  totalAmount,
  isLoading,
  onCtaClick,
}: {
  currentStep: number
  totalAmount: number
  isLoading: boolean
  onCtaClick: (step: number) => void
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 py-3 z-50 md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex-1 max-w-[200px]">
          <Button
            isLoading={isLoading}
            variant="primary"
            onClick={() => onCtaClick(currentStep)}
            label={getCtaLabel(currentStep)}
          />
        </div>
      </div>
    </div>
  )
}
