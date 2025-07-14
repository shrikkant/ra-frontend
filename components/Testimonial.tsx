'use client'
import React, {Fragment} from 'react'
import {ReactNode, useEffect, useState} from 'react'
import {StarIcon} from '@heroicons/react/24/solid'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline'

import {ITestimonial} from '../app-store/app-defaults/types'

import {Transition} from '@headlessui/react'

export function Testimonial() {
  const [items, setItems] = useState<ReactNode[]>([])
  const [currentItem, setCurrentItem] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

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

  const isActive = (index: number) => {
    return currentItem === index
  }

  useEffect(() => {
    const testimonials: ITestimonial[] = [
      {
        id: 1,
        name: 'Prathamesh Dalvi',
        rating: 5,
        description:
          '“I recently rented the Nikkor 70-300mm lens for a photo shoot and was extremely satisfied with my experience. The procedure was easy and lens was in excellent condition. The images I captured with this lens were stunning - the sharpness, color accuracy, and overall image quality were all exceptional.”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjUIHossDX68OWhierQScgMeRCBhRA9RwusuGCK3C8iqxZSVqxpU',
      },
      {
        id: 2,
        name: 'Sam Barton',
        rating: 4,
        description:
          'It was a great experience hassle free camera rental experience. As a beginner i Took Canon EOS 200 It came with dual lens and i loved taking pictures with it. Camera was in good condition and at a affordable price.',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocK1hTOa8OlfN77Klr7SstJT3ar_IFZMusfvgOT4CkN4jEWG8Q',
      },
      {
        id: 3,
        name: 'Prasad Kaiche',
        rating: 4,
        description:
          '“It was a very nice experience for getting the GoPro 11 from RentAcross. I was provided with the the proper mods and selfie stick for having perfect usage. Received multiple memory cards. Very much reliable and recommendable. Thanks for all the support.”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjWvQL2KRApAD6k8PgtB2sSMbhmCKCgQXG0VWaZdvmPmKfOBjGuL',
      },
      {
        id: 4,
        name: 'Aniket D',
        rating: 4,
        description:
          '“It was a great experience again! I did take DSLR on rent previously too. Process is quite simple and equipment was clean and in mint condition. I would highly recommend Rentacross if you need a DSLR.”',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocKTd0fQ1ZHDizpTXVhF8b67Apyti05HzkksPSBctJbUUkX_Dw',
      },
      {
        id: 5,
        name: 'Digvijay Gore',
        rating: 4,
        description:
          '“Hastle Free Services for Rental Camera and Gears in Pune City Best arrangement and convenient from Owner Recommend strongly for Rental Camera Services Budget Friendly Costs for all cameras”',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocLgzppJl3B9IZ8DKdsZgpRDUNwT6OGd6B4b7QUVigtA1CAASA',
      },
      {
        id: 6,
        name: 'Shridhar Kinkar',
        rating: 4,
        description:
          '“Rent Across is a very great initiative and its like a boon to photographers in areas like Baner, Pashan, Wakad, Hinjawadi & Punawale...I have availed their services twice for event photography and both the times it was a pleasant experience.Mr.Shrikant is a very nice and soft spoken person.Keep up the good work Team Rent Across 👍🏻👍🏻👍🏻”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjVc4w_Xfb94JWiOj2VXL73jk-uKwk9qHYMb1aK6l0H3WOiDxkOm',
      },
    ]

    // For mobile: one testimonial per slide
    // For desktop: three testimonials per slide
    const groupedTestimonials: ITestimonial[][] = []
    const isMobile = window.innerWidth < 768 // md breakpoint

    if (isMobile) {
      // One testimonial per slide for mobile
      testimonials.forEach(testimonial => {
        groupedTestimonials.push([testimonial])
      })
    } else {
      // Three testimonials per slide for desktop
      for (let i = 0; i < testimonials.length; i += 3) {
        groupedTestimonials.push(testimonials.slice(i, i + 3))
      }
    }

    const items = groupedTestimonials.map((group, groupIndex) => {
      return (
        <div
          key={groupIndex}
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${(groupIndex - currentItem) * 100}%)`,
          }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${groupIndex + 1} of ${groupedTestimonials.length}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
            {group.map((t, index) => (
              <div
                key={index}
                className="feedback-item transition duration-300 ease-in rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50"
              >
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
                <div className="feedback-content flex-grow flex items-center justify-center relative z-10 min-h-[200px]">
                  <p className="text-gray-700 text-base leading-7 italic text-center">
                    "{t.description}"
                  </p>
                </div>
                <div className="feedback-item-top flex items-center gap-4 border-t border-gray-100/50 pt-4 mt-auto relative z-10 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f7ca00] to-yellow-400 opacity-20 blur-sm"></div>
                    <img
                      src={t.img}
                      alt={`${t.name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#f7ca00] relative shadow-sm"
                    />
                  </div>
                  <div className="feedback-title flex flex-col justify-center">
                    <h5 className="title font-semibold text-gray-900 text-sm bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {t.name}
                    </h5>
                    <ul className="rating flex gap-1 mt-1.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <li key={i} className="text-[#f7ca00]">
                          <StarIcon className="w-4 h-4 drop-shadow-sm" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    })

    setItems(items)

    // Add resize listener to update grouping on window resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      if (newIsMobile !== isMobile) {
        // Re-trigger the grouping logic
        const newGroupedTestimonials: ITestimonial[][] = []
        if (newIsMobile) {
          testimonials.forEach(testimonial => {
            newGroupedTestimonials.push([testimonial])
          })
        } else {
          for (let i = 0; i < testimonials.length; i += 3) {
            newGroupedTestimonials.push(testimonials.slice(i, i + 3))
          }
        }
        setCurrentItem(0) // Reset to first slide when switching layouts
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentItem])

  // Add auto-scroll effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      next()
    }, 3000)

    return () => clearInterval(interval)
  }, [currentItem, isPaused])

  return (
    <section
      className="s-feedback"
      style={{backgroundImage: 'url(assets/v2/img/bg-feedback.webp)'}}
    >
      <span
        className="effwct-bg-feedback"
        style={{backgroundImage: 'url(assets/v2/img/effect-bg-feedback.svg)'}}
      ></span>
      <span className="mask"></span>
      <div className="sm:container mx-auto relative z-10 sm:px-2 xs:px-2">
        <h2 className="title">feedback</h2>
        <div
          className="feedback-slider relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[480px] md:h-[380px] overflow-hidden">
            <div className="relative w-full h-full">
              {items && items.map(item => item)}
            </div>
          </div>

          <div className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
            <button
              onClick={() => prev()}
              className="text-[#f7ca00] hover:text-[#e6b800] transition-all duration-300 hover:scale-110 group"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <div className="flex items-center gap-4">
              {items &&
                items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentItem(index)}
                    className={`w-2 p-0 h-2 rounded-full transition-all ${
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
              onClick={() => next()}
              className="text-[#f7ca00] hover:text-[#e6b800] transition-all duration-300 hover:scale-110 group"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
