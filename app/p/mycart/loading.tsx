import React from 'react'

export default function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cart items skeleton */}
        <div className="md:w-3/4 w-full">
          <div className="border rounded-md border-gray-200 divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Order summary skeleton */}
        <div className="md:w-1/4 w-full">
          <div className="p-4 border border-gray-200 rounded-md animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
            <div className="h-px bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
            <div className="h-10 bg-amber-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
