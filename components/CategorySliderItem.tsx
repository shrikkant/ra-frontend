import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
    <Link
      href={link}
      className="group block rounded-2xl overflow-hidden relative aspect-[3/2] md:aspect-[4/3] bg-gray-100"
    >
      {image && (
        <>
          <Image
            src={image}
            alt={`Rent ${title} in Pune`}
            width={480}
            height={360}
            quality={80}
            priority
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent transition-opacity duration-300 group-hover:from-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-semibold text-white transition-transform duration-300 group-hover:translate-x-1">
              {title}
              <span className="inline-block ml-1.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">&rarr;</span>
            </h3>
          </div>
        </>
      )}
    </Link>
  )
}
