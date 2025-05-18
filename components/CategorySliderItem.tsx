import React from 'react'
import Image from 'next/image'

interface CategorySliderItemProps {
  image?: string
  title: string
  link: string
}

export const CategorySliderItem: React.FC<CategorySliderItemProps> = ({
  image,
  title,
  link,
}) => {
  return (
    <a
      href={link}
      className="group block bg-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative aspect-square"
    >
      {image && (
        <div className="relative w-full h-full p-4">
          <Image
            src={image}
            alt={title}
            width={384}
            height={384}
            priority
            sizes="(max-width: 640px) 256px, 384px"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h4 className="text-xl font-semibold text-white group-hover:text-[#f7ca00] transition-colors duration-200 text-center">
              {title}
            </h4>
          </div>
        </div>
      )}
    </a>
  )
}
