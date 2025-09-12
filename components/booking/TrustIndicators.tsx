'use client'
import React from 'react'
import {FaWhatsapp} from 'react-icons/fa'

export const TrustIndicators: React.FC = () => {
  return (
    <div className="text-center pt-4 border-t border-gray-200">
      <div className="flex items-center justify-center gap-2">
        <span className="text-md font-medium text-gray-800">
          Psst! Save up to 30% more!
        </span>
        <a
          href="https://wa.me/7720829444?text=Hi%2C%20I%20am%20looking%20for%20a%20camera%20on%20rent.%20"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors animate-pulse"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>WhatsApp us</span>
        </a>
      </div>
    </div>
  )
}
