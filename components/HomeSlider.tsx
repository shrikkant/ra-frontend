'use client'
import React from 'react'
import {ReactNode, useEffect, useState} from 'react'
import {IHomeSlide} from '../app-store/products/types'
import Image from 'next/image'
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa'

const CameraBg = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="camera-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#camera-glow)" filter="url(#glow)">
      <animate
        attributeName="r"
        values="40;45;40"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
)

const CameraBg2 = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="camera2-glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
      </linearGradient>
    </defs>
    <path
      d="M0,50 Q25,20 50,50 T100,50"
      fill="none"
      stroke="url(#camera2-glow)"
      strokeWidth="2"
    >
      <animate
        attributeName="d"
        values="M0,50 Q25,20 50,50 T100,50;M0,50 Q25,80 50,50 T100,50;M0,50 Q25,20 50,50 T100,50"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

const CampingBg = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="camping-glow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
      </linearGradient>
    </defs>
    <path
      d="M0,50 C20,30 40,70 60,50 S80,30 100,50"
      fill="none"
      stroke="url(#camping-glow)"
      strokeWidth="3"
    >
      <animate
        attributeName="d"
        values="M0,50 C20,30 40,70 60,50 S80,30 100,50;M0,50 C20,70 40,30 60,50 S80,70 100,50;M0,50 C20,30 40,70 60,50 S80,30 100,50"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

const CameraBg3 = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="camera3-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
      </linearGradient>
    </defs>
    <rect
      x="20"
      y="20"
      width="60"
      height="60"
      fill="none"
      stroke="url(#camera3-glow)"
      strokeWidth="2"
    >
      <animate
        attributeName="width"
        values="60;65;60"
        dur="3s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="height"
        values="60;65;60"
        dur="3s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
)

export function HomeSlider() {
  const INTERVAL_LENGTH = 6000
  const AUTOPLAY = true
  const autoplay = AUTOPLAY
  const [currentItem, setCurrentItem] = useState(0)
  const [items, setItems] = useState<ReactNode[]>([])

  const prev = () => {
    if (currentItem === 0) {
      setCurrentItem(items.length - 1)
    } else {
      setCurrentItem(currentItem - 1)
    }
  }
  const next = () => {
    if (currentItem === items.length - 1) {
      setCurrentItem(0)
    } else {
      setCurrentItem(currentItem + 1)
    }
  }

  useEffect(() => {
    const photos: IHomeSlide[] = [
      {
        id: 1,
        title: 'Go Mirrorless with Canon R10 Camera',
        subtitle: 'Capture Every Moment with the Versatile Canon R10',
        img: '/assets/v2/img/canon-r10-mirrorless-camera.webp',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 800,
        model: 'Canon R10',
        url: '/pune/rent-camera/canon-eos-r10-mirrorless-digital-camera-3494',
      },
      {
        id: 2,
        title: 'Go 360 with Insta360 X3',
        subtitle:
          'What more do you need when you can capture your moments in 360!',
        img: '/assets/v2/img/insta-360-x3.webp',
        imgBg: '/assets/v2/img/bg-slider-2.svg',
        price: 900,
        model: 'model M-300',
        url: '/pune/rent-gopro-cameras/Insta360-ONE-X2-3452',
      },
      {
        id: 3,
        title: 'Camp anywhere anytime',
        subtitle: 'Rent a camping tent for your next adventure.',
        img: '/assets/v2/img/4-person-camping-tent-waterproof.webp',
        imgBg: '/assets/v2/img/bg-slider-3.svg',
        price: 500,
        model: 'model X-230',
        url: '/pune/rent-camping-tents/Coleman-Camping-Tent-with-Fibreglass-poles-4-Person-3482',
      },
      {
        id: 4,
        title: 'Sony A7 M3 ',
        subtitle: 'Go mirrorless with Sony A7 M3',
        img: '/assets/v2/img/sony-a7-m3-camera.webp',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 1500,
        model: 'model X-230',
        url: '/pune/rent-camera/Sony-A7-M-III-3317',
      },
    ]

    const items = photos?.map((p, index) => {
      const BackgroundComponent = [CameraBg, CameraBg2, CampingBg, CameraBg3][
        index
      ]

      return (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            currentItem === index
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full'
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${photos.length}`}
        >
          <div className="relative h-full w-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${p.imgBg})`,
              }}
            />
            <BackgroundComponent />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 via-zinc-700/40 to-white" />

            <div className="w-full h-full relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center h-full max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="pt-8 md:pt-0">
                  <div className="max-w-lg">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      {p.title}
                    </h1>
                    <p className="text-base md:text-lg text-gray-200 mb-8">
                      {p.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={p.url}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#f7ca00] text-gray-900 font-medium rounded-lg hover:bg-[#1f2937] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </a>
                      <div className="flex items-center gap-2 text-gray-200">
                        <span>Starting from</span>
                        <span className="text-xl font-semibold text-white">
                          ₹{p.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md mx-auto">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }) as ReactNode[]

    setItems(items)

    if (!autoplay) return
    const interval = setInterval(next, INTERVAL_LENGTH)

    return () => clearInterval(interval)
  }, [currentItem])

  const changeSlide = (index: number) => {
    setCurrentItem(index)
  }

  return (
    <section className="relative bg-white">
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {items && items.map(item => item)}
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Previous slide"
          >
            <FaAngleLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1.5">
            {items &&
              items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentItem
                      ? 'bg-[#f7ca00] scale-125'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentItem}
                />
              ))}
          </div>

          <button
            onClick={next}
            className="p-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Next slide"
          >
            <FaAngleRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
