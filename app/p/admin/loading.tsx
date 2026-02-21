import React from 'react'

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:block w-64 bg-gray-100 animate-pulse">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-px bg-gray-200" />
          {/* Table skeleton */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 h-10" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex gap-4 p-3 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
