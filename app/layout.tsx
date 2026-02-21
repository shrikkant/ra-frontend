import React, {Suspense} from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import StoreProvider from './StoreProvider'
import Script from 'next/script'
import {Roboto_Condensed} from 'next/font/google'

// CSS imports - ensure proper order
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'
import 'styles/layout-shift-prevention.css'

import type {Metadata, Viewport} from 'next'
import {GoogleTagManager} from '@next/third-parties/google'
import LazyToastContainer from './components/LazyToastContainer'
import NavigationProgress from './components/common/NavigationProgress'

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-condensed',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

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
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <head>
        <meta name="robots" content="index, follow"></meta>

        <meta
          name="keywords"
          content="Rent DSLR Cameras, Rent GoPro, Rent Video Cameras, Rent DSLR Lenses, Camera Rental Community, Online Camera Rental Store"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/v2/img/favicon.ico"
        />

        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
        <meta
          name="google-site-verification"
          content="bk-pBKeRJOZYfiWkLC927Y2SVdFADUPUcVrtXVgh4tQ"
        />

        <GoogleTagManager gtmId="GTM-TPF56M8" />

        {/* Preconnect to critical image domains for faster LCP */}
        <link rel="preconnect" href="https://rentacross.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />

        <link rel="dns-prefetch" href="https://rentacross.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://app.statwide.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.heapanalytics.com" />
      </head>
      <body>
        <Suspense
          fallback={
            <div className="min-h-screen">
              {/* Header skeleton */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 h-16 animate-pulse" />
              {/* Content skeleton */}
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <StoreProvider>
            <NavigationProgress />
            <Header />
            <div>{children}</div>
            <Footer />
          </StoreProvider>

          <LazyToastContainer />
        </Suspense>

        {/* Google reCAPTCHA v3 - loaded after page interactive */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
