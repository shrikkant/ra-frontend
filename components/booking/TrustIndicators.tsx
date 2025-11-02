'use client'
import React from 'react'
import {FaShieldAlt, FaCheckCircle, FaMoneyBillWave} from 'react-icons/fa'

export const TrustIndicators: React.FC = () => {
  return (
    <div className="text-center pt-4 border-t border-gray-200">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-gray-700">
          <FaCheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">No hidden charges</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-700">
          <FaShieldAlt className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">No verification hassles</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-700">
          <FaMoneyBillWave className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">Zero deposit</span>
        </div>
      </div>
    </div>
  )
}
