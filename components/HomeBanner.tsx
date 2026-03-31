import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {locationCity, getSubCategorySlugById} from '../util/search.util'
import {IProductFilter, IProductCategory} from '../app-store/types'

interface HomeBannerProps {
  city?: string
  category?: string
  filter?: IProductFilter
  categories?: IProductCategory[]
}

export function HomeBanner({
  city,
  category,
  filter,
  categories,
}: HomeBannerProps) {
  const currentCity = filter?.city || city || 'pune'

  let currentCategory = category || 'rent-camera'
  if (filter?.subCategory && categories) {
    const categorySlug = getSubCategorySlugById(filter.subCategory, categories)
    if (categorySlug) {
      currentCategory = categorySlug
    }
  }

  const browseHref = `/${locationCity(currentCity, true)}/${currentCategory}?q=`

  return (
    <section
      aria-label="Rent cameras and photography equipment"
      className="relative overflow-hidden bg-[#fafaf8]"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#f7ca00]/[0.07] blur-[100px] animate-glow-drift" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[80px] animate-glow-drift [animation-delay:4s]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden pt-8 pb-10">
          {/* Social proof chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 text-xs text-gray-500 shadow-sm mb-6">
            <svg className="w-3.5 h-3.5 text-[#f7ca00]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            4.9 · 1,500+ rentals
          </div>

          <h1 className="text-[2.25rem] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Rent the gear.
            <br />
            <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Skip the price tag.</span>
          </h1>

          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            Cameras delivered to your door. Book in 2&nbsp;minutes.
          </p>

          {/* Hero product — big, visual, tappable */}
          <Link href={browseHref} className="block mt-6">
            <div className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-xl shadow-gray-200/30 aspect-[3/2]">
              {/* Warm glow behind product */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#f7ca00]/15 via-amber-300/10 to-transparent blur-[40px]" />
              </div>
              <Image
                src="/assets/v2/img/canon-r10-mirrorless-camera.webp"
                alt="Canon R10 mirrorless camera available for rent"
                fill
                className="object-contain p-6 drop-shadow-md relative z-10"
                priority
                sizes="100vw"
              />
              {/* Price pill overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm z-10">
                <div className="text-[11px] text-gray-400">Starting from</div>
                <div className="text-lg font-bold text-gray-900 -mt-0.5">₹450<span className="text-xs font-normal text-gray-400">/day</span></div>
              </div>
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-[#f7ca00] text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                Popular
              </div>
            </div>
          </Link>

          {/* Trust micro-strip */}
          <div className="flex items-center gap-4 mt-5 text-[12px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Same-day delivery
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              No deposit
            </span>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-16 items-center pt-16 lg:pt-20 pb-20 lg:pb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 text-sm text-gray-600 shadow-sm mb-8">
              <svg className="w-4 h-4 text-[#f7ca00]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.9 on Google&nbsp;&middot;&nbsp;1,500+ rentals
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.08]">
              Rent the gear.
              <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Skip the price tag.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-md leading-relaxed">
              Canon, Sony & Nikon cameras delivered to your door in Pune. Book in 2&nbsp;minutes.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={browseHref}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium rounded-full shadow-lg shadow-gray-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-900/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse gear
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <span className="text-sm text-gray-400">from ₹450/day</span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Same-day delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                No deposit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Free cancellation
              </span>
            </div>
          </div>

          {/* Desktop hero image */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#f7ca00]/20 via-amber-300/10 to-orange-200/10 blur-[60px]" />
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-2xl shadow-gray-200/40">
              <Image
                src="/assets/v2/img/canon-r10-mirrorless-camera.webp"
                alt="Canon R10 mirrorless camera available for rent"
                fill
                className="object-contain p-10 drop-shadow-lg"
                priority
                sizes="50vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl shadow-gray-200/50 px-5 py-3.5 border border-gray-100/80">
              <div className="text-xs text-gray-400 mb-0.5">Canon EOS R10</div>
              <div className="text-xl font-bold text-gray-900">₹800<span className="text-sm font-normal text-gray-400">/day</span></div>
            </div>
            <div className="absolute -top-2 -right-2 bg-[#f7ca00] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#f7ca00]/20">
              Most Popular
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
