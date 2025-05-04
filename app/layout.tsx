import React, {Suspense} from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../styles/global.css'
import StoreProvider from './StoreProvider'

// import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import type {Metadata, Viewport} from 'next'
import {GoogleTagManager} from '@next/third-parties/google'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SetUTMCookie from './components/common/SetUTMCookie'

interface IOpenImage {
  url: string
  alt: string
}

interface IMetadata {
  title: string
  description: string
  openGraph?: {
    title: string
    description: string
    url: string
    siteName: string
    images: IOpenImage[]
    type: string
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Top-Quality Camera Rentals – Shoot Without Limits'
  const description =
    'Get high-quality cameras, lenses, and accessories on rent.' +
    'Flexible rental plans, top brands, and easy booking for photographers, filmmakers, and content creators. Shoot without limits! '
  const metadata: IMetadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://rentacross.com/',
      images: [
        {
          url: 'https://rentacross.com//assets/v2/img/rentacross-camera-rental.webp',
          alt: 'Top-Quality Camera Rentals – Shoot Without Limits',
        },
        {
          url: 'https://rentacross.com//assets/v2/img/rentacross-camera-rental-1.webp',
          alt: 'Capture More, Spend Less – Rent Cameras & Gear',
        },
        {
          url: 'https://rentacross.com//assets/v2/img/rentacross-camera-rental-2.webp',
          alt: 'Rent. Shoot. Create. Hassle-Free Camera Rentals',
        },
        {
          url: 'https://rentacross.com//assets/v2/img/rentacross-camera-rental-3.webp',
          alt: 'Shoot Like a Pro – Rent Cameras & Lenses with Ease',
        },
      ],
      type: 'website',
      siteName: 'RentAcross',
    },
  }

  return metadata
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  // const categories: IProductCategory[] = await fetchData('categories');

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow"></meta>

        <meta
          name="keywords"
          content="Rent DSLR Cameras, Rent GoPro, Rent Video Cameras, Rent DSLR Lenses, Camera Rental Community, Online Camera Rental Store"
        />
        <link rel="stylesheet" href="/assets/v2/css/slick.min.css"></link>
        <link
          rel="stylesheet"
          href="/assets/v2/css/font-awesome.min.css"
        ></link>
        <link rel="stylesheet" href="/assets/v2/css/nice-select.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
        <meta
          name="google-site-verification"
          content="bk-pBKeRJOZYfiWkLC927Y2SVdFADUPUcVrtXVgh4tQ"
        />

        <GoogleTagManager gtmId="GTM-TPF56M8" />
        <link rel="dns-prefetch" href="https://app.statwide.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.heapanalytics.com" />
      </head>
      <SetUTMCookie />
      <body>
        <div className="preloader-cover">
          <div className="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="preloader-cover">
              <div className="preloader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <StoreProvider>
            <Header />
            <div className="px-2">{children}</div>
            <Footer />
          </StoreProvider>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </Suspense>
      </body>
    </html>
  )
}
