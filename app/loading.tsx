import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero banner placeholder */}
        <div className="h-48 sm:h-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="border border-gray-100 bg-white rounded-lg overflow-hidden animate-pulse">
              <div className="h-[240px] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
