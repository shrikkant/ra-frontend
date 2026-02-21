import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="border border-gray-100 w-full h-full bg-white flex flex-col sm:rounded-lg overflow-hidden animate-pulse">
      {/* Mobile skeleton */}
      <div className="flex sm:hidden p-2 gap-2">
        <div className="w-2/5 flex-shrink-0">
          <div className="w-full h-[120px] bg-gray-200 rounded" />
        </div>
        <div className="w-3/5 flex flex-col justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <div className="p-4">
          <div className="w-full h-[240px] bg-gray-200 rounded" />
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  )
}
