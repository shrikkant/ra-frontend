import React from 'react'

interface CityHeroBannerProps {
  city: string
  title: string
  cityImage: string
  cityImageMobile: string
  description: string
}

const CityHeroBanner: React.FC<CityHeroBannerProps> = ({
  city,
  title,
  cityImage,
  cityImageMobile,
  description,
}) => {
  return (
    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 640px)" srcSet={cityImageMobile} />
          <img
            src={cityImage}
            alt={`${city} city view`}
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CityHeroBanner
