'use client'
import React from 'react'
import Image from 'next/image'
import {useState} from 'react'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
  className?: string
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          quality={75}
          loading="lazy"
          className={`
            duration-700 ease-in-out w-full h-full object-contain
            ${isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-md'}
          `}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      ) : (
        // Fallback placeholder when image fails to load
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image unavailable</div>
        </div>
      )}
    </div>
  )
}

export default LazyImage
