import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HomeProductCardProps {
  title: string
  price: number
  image: string
  features: string[]
  href: string
  priority?: boolean
}

export function HomeProductCard({
  title,
  price,
  image,
  features,
  href,
  priority = false,
}: HomeProductCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white/90 text-gray-900 p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1 group">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image src={image} alt={title} fill className="object-contain" priority={priority} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-[#f7ca00] font-bold">₹{price}/day</div>
            <div className="text-xs text-gray-500 space-y-1 mt-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f7ca00]"></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
