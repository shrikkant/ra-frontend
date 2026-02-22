import React from 'react'
import SkeletonCard from '../../components/common/SkeletonCard'

function PulseBlock({className}: {className: string}) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="md:w-2/3 space-y-4">
        <PulseBlock className="w-full aspect-[4/3] rounded-lg" />
        <PulseBlock className="h-6 w-3/4" />
        <PulseBlock className="h-4 w-1/2" />
        <PulseBlock className="h-4 w-full" />
        <PulseBlock className="h-4 w-5/6" />
      </div>
      <div className="md:w-1/3">
        <div className="border border-gray-200 rounded-lg p-4 md:p-5 space-y-4">
          <PulseBlock className="h-6 w-1/2" />
          <PulseBlock className="h-10 w-full" />
          <PulseBlock className="h-10 w-full" />
          <div className="h-px bg-gray-200" />
          <PulseBlock className="h-5 w-2/3" />
          <div className="h-12 bg-amber-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function ListingSkeleton() {
  return (
    <div>
      <PulseBlock className="h-4 w-48 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({length: 8}).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default function SlugLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile: product detail skeleton (stacked, full-width image) */}
      <div className="md:hidden">
        <PulseBlock className="h-4 w-48 mb-4" />
        <ProductDetailSkeleton />
      </div>
      {/* Desktop: listing grid skeleton (more common landing) */}
      <div className="hidden md:block">
        <ListingSkeleton />
      </div>
    </div>
  )
}
