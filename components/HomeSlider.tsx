'use client'
import React from 'react'
import {ReactNode, useEffect, useState} from 'react'
import {IHomeSlide} from '../app-store/products/types'
import Image from 'next/image'
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa'

export function HomeSlider() {
  const INTERVAL_LENGTH = 6000
  const AUTOPLAY = false
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
        id: 3,
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
      return (
        <div
          key={index}
          className={
            'main-slide ' +
            (currentItem === index ? 'slick-current slick-active' : '')
          }
          style={{
            width: '100%',
            top: 0,
            zIndex: currentItem === index ? 999 : 998,
            opacity: 1,
          }}
        >
          <div
            className="main-slide-bg bg-contain bg-center bg-no-repeat absolute inset-0 -z-10 sm:bg-cover"
            style={{
              backgroundImage: 'url(' + p.imgBg + ')',
            }}
          ></div>
          <div>
            <div className="main-slide-info">
              <h1 className="title text-2xl">{p.title}</h1>
              <p>{p.subtitle}</p>
              <a href={p.url} className="btn">
                <span>Book Now</span>
              </a>
            </div>
            <div className="slide-img-cover">
              <a href={p.url} className="lable-bike">
                <div className="lable-bike-img p-2">
                  <Image
                    src={p.img}
                    alt={p.subtitle}
                    width={64}
                    height={64}
                    style={{objectFit: 'cover'}}
                    sizes="64px"
                    quality={75}
                  />
                </div>
                <div className="lable-bike-item">
                  <div className="model">Starting</div>
                  <div className="price">₹{p.price}</div>
                </div>
              </a>

              <div>
                <Image
                  src={p.img}
                  alt="img"
                  className={'slide-img'}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                  }}
                />
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
    <section className="m-auto sm:container">
      <ul className="main-soc-list">
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.facebook.com/rentacross"
          >
            facebook
          </a>
        </li>
        <li>
          <a rel="noreferrer" target="_blank" href="https://x.com/rentacross">
            twitter
          </a>
        </li>
        <li>
          <a
            rel="noreferrer"
            href="https://www.instagram.com/rent_across"
            target="_blank"
          >
            instagram
          </a>
        </li>
      </ul>

      <section className="main-slider py-2 relative w-full overflow-hidden xs:px-4 xs:h-[420px] sm:h-[640px] lg:h-[720px]">
        <div
          className="slick-list draggable"
          style={{
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="slick-track"
            style={{
              transformStyle: 'preserve-3d',
              width: '100%',
              height: '100%',
            }}
          >
            {items && items.map(item => item)}
          </div>
        </div>
      </section>
      <div role="toolbar" className="py-4">
        <div
          className="flex justify-center bg-gradient-to-t from-gray-200 to-transparent  rounded-full pt-2 w-96 m-auto"
          role="tablist"
        >
          <div>
            <button type="button" onClick={prev} className="px-2">
              <FaAngleLeft className="h-6" />
            </button>
          </div>

          {items &&
            items.map((_, index) => {
              return (
                <div
                  key={index}
                  onClick={() => changeSlide(index)}
                  aria-hidden="true"
                  role="presentation"
                  aria-selected="false"
                  aria-controls="navigation30"
                  id={'slick-slide3' + index}
                  className={
                    'font-normal text-gray-400 hover:text-gray-800 hover:font-semibold hover:text-2xl' +
                    (index == currentItem
                      ? ' font-semibold text-gray-800 text-2xl'
                      : '')
                  }
                >
                  <button type="button" data-role="none" role="button">
                    {index + 1}
                  </button>
                </div>
              )
            })}
          <div>
            <button type="button" onClick={next} className="px-2">
              <FaAngleRight className="h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
