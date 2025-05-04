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

  return (
    <div className={`relative overflow-hidden ${className}`}>
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
          duration-700 ease-in-out
          ${isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-md'}
        `}
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
      />
    </div>
  )
}

export default LazyImage
