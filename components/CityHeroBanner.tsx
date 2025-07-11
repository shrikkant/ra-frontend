import React from 'react'
import Image from 'next/image'

interface CityHeroBannerProps {
  city: string
  title: string
  cityImage: string
}

const CityHeroBanner: React.FC<CityHeroBannerProps> = ({
  city,
  title,
  cityImage,
}) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden xs:mb-4 sm:mb-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={cityImage}
          alt={`${city} city view`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Capture your moments with premium equipment. Fast delivery, flexible
            rentals, and expert support.
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
