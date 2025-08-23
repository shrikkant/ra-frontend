'use client'
import React from 'react'

export const BlogHeroSkeleton: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center animate-pulse">
          {/* Badge Skeleton */}
          <div className="inline-block h-10 w-80 bg-gray-700 rounded-full mb-8"></div>
          
          {/* Title Skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-16 bg-gray-700 rounded-lg mx-auto w-96"></div>
            <div className="h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg mx-auto w-80"></div>
          </div>
          
          {/* Subtitle Skeleton */}
          <div className="space-y-3 mb-12">
            <div className="h-6 bg-gray-700 rounded mx-auto w-3/4"></div>
            <div className="h-6 bg-gray-700 rounded mx-auto w-2/3"></div>
          </div>
          
          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="h-14 w-40 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl"></div>
            <div className="h-14 w-32 bg-gray-700 rounded-2xl border-2 border-gray-600"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-700/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-16 bg-gray-700 rounded mx-auto mb-3"></div>
                <div className="h-4 w-24 bg-gray-700 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export const FeaturedPostSkeleton: React.FC = () => {
  return (
    <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100/50 animate-pulse">
      <div className="lg:flex">
        {/* Image Skeleton */}
        <div className="lg:w-1/2">
          <div className="relative h-64 lg:h-full min-h-[300px] bg-gray-200">
            <div className="absolute top-6 left-6">
              <div className="h-8 w-24 bg-orange-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Category */}
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-orange-100 rounded-full"></div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Button */}
          <div className="h-12 w-40 bg-gradient-to-r from-orange-300 to-orange-400 rounded-2xl"></div>
        </div>
      </div>
    </article>
  )
}

export const BlogCardSkeleton: React.FC = () => {
  return (
    <article className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200"></div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="h-5 w-16 bg-orange-100 rounded-full"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Meta */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-3">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-20 bg-orange-100 rounded-lg"></div>
        </div>
      </div>
    </article>
  )
}

export const BlogPageSkeleton: React.FC = () => {
  return (
    <>
      <BlogHeroSkeleton />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Featured Post Skeleton */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-4 h-0.5 flex-1 bg-gray-200"></div>
            </div>
            <FeaturedPostSkeleton />
          </section>

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Categories Skeleton */}
              <div className="mb-8">
                <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Blog Grid Skeleton */}
              <section className="mt-12">
                <div className="flex items-center mb-8">
                  <div className="h-8 w-36 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-4 h-0.5 flex-1 bg-gray-200"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </section>
            </main>

            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <div className="sticky top-8 space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}