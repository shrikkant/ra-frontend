import React from 'react'
import {StarIcon} from '@heroicons/react/24/solid'

interface RatingStarsProps {
  count?: number
  size?: 'sm' | 'md'
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
}

export default function RatingStars({count = 5, size = 'md'}: RatingStarsProps) {
  return (
    <div className="flex">
      {[...Array(count)].map((_, i) => (
        <StarIcon key={i} className={`text-[#f7ca00] ${sizeMap[size]}`} />
      ))}
    </div>
  )
}
