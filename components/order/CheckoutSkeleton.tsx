import React from 'react'

export function CheckoutSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-3 md:px-6 py-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3 space-y-4">
          <div className="border rounded-md p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="md:w-1/3">
          <div className="p-4 border rounded-md space-y-3">
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-10 bg-amber-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
