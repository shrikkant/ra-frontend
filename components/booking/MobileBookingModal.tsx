'use client'
import React from 'react'

interface MobileBookingModalProps {
  children: React.ReactNode
  onClose: () => void
}

export const MobileBookingModal: React.FC<MobileBookingModalProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-white md:hidden z-[500]">
      {/* Header with close button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="text-lg font-semibold text-gray-900">Book Now</h2>
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-bold text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  )
}
