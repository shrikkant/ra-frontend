import React from 'react'
import {reviews} from './home/reviews-data'
import ReviewCard from './common/ReviewCard'
import RatingStars from './common/RatingStars'
import SectionHeader from './common/SectionHeader'
import HorizontalScroller from './common/HorizontalScroller'
import ScrollerItem from './common/ScrollerItem'
import {GOOGLE_RATING, TOTAL_RENTALS} from '../config/home.constants'

interface ReviewsSectionProps {
  title?: string
  subtitle?: string
  showOverallRating?: boolean
  showCTA?: boolean
  variant?: 'compact' | 'full'
  maxReviews?: number
  className?: string
}

export function ReviewsSection(props: ReviewsSectionProps) {
  const {
    title,
    variant = 'full',
    maxReviews = 6,
    className = '',
  } = props

  const isCompact = variant === 'compact'
  const displayReviews = reviews.slice(0, isCompact ? maxReviews : 6)

  // Compact variant — used on product/city pages
  if (isCompact) {
    return (
      <section
        aria-label="Customer reviews"
        className={`py-12 bg-white ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          )}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map(review => (
              <ReviewCard
                key={review.id}
                variant="compact"
                {...review}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default — home page social proof
  return (
    <section
      aria-label="Customer reviews"
      className={`relative overflow-hidden bg-white ${className}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f7ca00]/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto py-10 sm:py-16 md:py-20">
        {/* Header with rating */}
        <div className="px-4 sm:px-6 lg:px-8 mb-5 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Loved by creators
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <RatingStars />
            <span className="text-sm font-medium text-gray-900">{GOOGLE_RATING}</span>
            <span className="text-sm text-gray-500">&middot; {TOTAL_RENTALS} on Google</span>
          </div>
        </div>

        {/* Mobile: horizontal scroll · Desktop: 3-col grid */}
        <HorizontalScroller desktopCols="md:grid-cols-3">
          {displayReviews.map((review, i) => (
            <ScrollerItem key={review.id} mobileWidth="w-[78vw]" snap="center">
              <ReviewCard
                {...review}
                imgLoading={i < 3 ? 'eager' : 'lazy'}
              />
            </ScrollerItem>
          ))}
        </HorizontalScroller>
      </div>
    </section>
  )
}
