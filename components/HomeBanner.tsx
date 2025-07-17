'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {HomeProductCard} from './HomeProductCard'

export function HomeBanner() {
  const featuredProducts = [
    {
      title: 'Canon R10',
      price: 800,
      image: '/assets/v2/img/canon-r10-mirrorless-camera.webp',
      features: ['Mirrorless Camera', 'APS-C Sensor'],
      href: '/pune/rent-camera/canon-eos-r10-mirrorless-digital-camera-3494',
    },
    {
      title: 'Insta360 X3',
      price: 900,
      image: '/assets/v2/img/insta-360-x3.webp',
      features: ['360° Camera', '5.7K Video'],
      href: '/pune/rent-gopro-cameras/Insta360-ONE-X2-3452',
    },
    {
      title: 'GoPro Hero 12 Black',
      price: 500,
      image: '/assets/v2/img/gopro-hero-12-black.webp',
      features: ['4K Video', '12MP Photo'],
      href: '/pune/rent-gopro-cameras/GoPro-HERO12-Black-3497',
    },
    {
      title: 'Sony A7 M3',
      price: 1500,
      image: '/assets/v2/img/sony-a7-m3-camera.webp',
      features: ['Full Frame', '4K Video'],
      href: '/pune/rent-camera/Sony-A7-M-III-3317',
    },
  ]

  return (
    <section className="relative bg-gradient-to-b from-[#1f2937] via-[#1a2234]/95 to-[#111827]/90 min-h-[60vh] md:min-h-[50vh] flex items-center overflow-hidden py-12 md:py-8 z-0">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] text-white/3 text-6xl animate-float blur-[2px]">
          📷
        </div>
        <div className="absolute top-[20%] right-[15%] text-white/3 text-6xl animate-float animation-delay-2000 blur-[2px]">
          🎬
        </div>
        <div className="absolute bottom-[20%] left-[20%] text-white/3 text-6xl animate-float animation-delay-4000 blur-[2px]">
          📸
        </div>
      </div>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Rent Cameras
              <br />
              Starting <span className="text-[#f7ca00]">₹450/day</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8">
              Get premium Sony, Canon & Nikon gear delivered to your doorstep.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f7ca00] text-gray-900 text-xs">
                  ✓
                </span>
                Same-day delivery
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f7ca00] text-gray-900 text-xs">
                  ✓
                </span>
                Zero security hassles
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f7ca00] text-gray-900 text-xs">
                  ✓
                </span>
                Hassle-free booking
              </div>
            </div>

            <div className="mb-12">
              <Link
                href="/pune/rent-camera"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#f7ca00] font-semibold rounded-xl transition-all duration-300 hover:bg-[#f4c500] hover:shadow-sm hover:shadow-[#f4c500]/10 active:bg-[#f2c000] text-gray-900"
              >
                Browse Cameras →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <span className="block text-2xl font-bold text-[#f7ca00]">
                  1500+
                </span>
                <span className="text-sm text-white/80">Happy Customers</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-[#f7ca00]">
                  4.9
                </span>
                <span className="text-sm text-white/80">Google Reviews</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-[#f7ca00]">
                  24/7
                </span>
                <span className="text-sm text-white/80">Support</span>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-10 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {featuredProducts.map((product, index) => (
                  <HomeProductCard
                    key={index}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    features={product.features}
                    href={product.href}
                  />
                ))}
              </div>

              <div className="text-[#f7ca00] py-2 px-3 sm:px-4 rounded-lg text-center text-sm sm:text-base font-semibold">
                🔥 Weekend slots filling fast - Book now!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
