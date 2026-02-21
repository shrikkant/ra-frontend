import React from 'react'

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

export function TrustIndicators() {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex flex-wrap gap-3 justify-center text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <CheckCircleIcon />
          <span className="font-medium">No hidden charges</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <ShieldIcon />
          <span className="font-medium">Zero deposit</span>
        </div>
      </div>
    </div>
  )
}
