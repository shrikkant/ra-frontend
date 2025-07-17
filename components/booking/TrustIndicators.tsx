'use client'
import React from 'react'

export const TrustIndicators: React.FC = () => {
  return (
    <div className="text-center pt-4 border-t border-gray-200">
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Verified Equipment</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  )
}
