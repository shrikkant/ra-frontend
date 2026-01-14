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
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden xs:mb-4 sm:mb-8">
      {/* Background Image with Overlay - using picture for responsive images */}
      <div className="absolute inset-0">
        <picture>
          {/* Mobile: small 640px image (~25KB) */}
          <source media="(max-width: 640px)" srcSet={cityImageMobile} />
          {/* Desktop: full size image */}
          <img
            src={cityImage}
            alt={`${city} city view`}
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>

      {/* Diagonal Clip Effect */}
      <div className="absolute bottom-0 left-0 w-full xs:h-8 sm:h-12 md:h-16 bg-gradient-to-t from-black/50 to-transparent" />
      <div
        className="absolute bottom-0 left-0 w-full xs:h-8 sm:h-12 md:h-16 bg-white"
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 0, 25% 100%)',
        }}
      />
    </div>
  )
}

export default CityHeroBanner
