import React from 'react'
import RatingStars from './RatingStars'

interface ReviewCardProps {
  name: string
  rating: number
  description: string
  img: string
  location?: string
  variant?: 'compact' | 'full'
  imgLoading?: 'eager' | 'lazy'
}

export default function ReviewCard({
  name,
  rating,
  description,
  img,
  location,
  variant = 'full',
  imgLoading = 'lazy',
}: ReviewCardProps) {
  const isCompact = variant === 'compact'

  return (
    <article
      className={`group flex flex-col ${
        isCompact
          ? 'bg-white rounded-xl border border-gray-100 p-4'
          : 'relative p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-[#fafaf8] border border-gray-100/80 transition-all duration-300 md:hover:shadow-lg md:hover:shadow-gray-200/40 md:hover:-translate-y-0.5'
      }`}
    >
      {/* Hover accent — desktop only, full variant */}
      {!isCompact && (
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#f7ca00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
      )}

      <div className={`flex items-center gap-1 ${isCompact ? 'mb-2' : 'mb-3'}`}>
        <RatingStars count={rating} size={isCompact ? 'sm' : 'md'} />
      </div>

      <blockquote
        className={`leading-relaxed flex-grow ${
          isCompact
            ? 'text-xs text-gray-600 mb-3'
            : 'text-[14px] sm:text-[15px] text-gray-600'
        }`}
      >
        &ldquo;{description}&rdquo;
      </blockquote>

      <div className={`flex items-center gap-3 mt-auto ${isCompact ? '' : 'mt-4'}`}>
        <img
          src={img}
          alt={name}
          className={`rounded-full object-cover ${
            isCompact
              ? 'w-8 h-8'
              : 'w-9 h-9 ring-2 ring-white shadow-sm'
          }`}
          loading={imgLoading}
        />
        <div>
          <cite
            className={`font-medium text-gray-900 not-italic block ${
              isCompact ? 'text-xs' : 'text-sm font-semibold'
            }`}
          >
            {name}
          </cite>
          {location && (
            <span className="text-xs text-gray-500">{location}</span>
          )}
        </div>
      </div>
    </article>
  )
}
