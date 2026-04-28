import React, {Suspense} from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import HeaderRouteGate from './components/HeaderRouteGate'
import StoreProvider from './StoreProvider'
import Script from 'next/script'
import {Roboto_Condensed, Jost, Inter_Tight, JetBrains_Mono} from 'next/font/google'

// CSS imports - ensure proper order
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'
import 'styles/layout-shift-prevention.css'

import type {Metadata, Viewport} from 'next'
import LazyToastContainer from './components/LazyToastContainer'
import NavigationProgress from './components/common/NavigationProgress'

const GTM_ID = 'GTM-TPF56M8'

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-condensed',
})

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter-tight',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
  variable: '--font-jetbrains-mono',
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
    <html
      lang="en"
      className={`${robotoCondensed.variable} ${jost.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
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

        <meta
          name="google-site-verification"
          content="bk-pBKeRJOZYfiWkLC927Y2SVdFADUPUcVrtXVgh4tQ"
        />

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
            <HeaderRouteGate>
              <Header />
            </HeaderRouteGate>
            <div>{children}</div>
            <Footer />
          </StoreProvider>
        </Suspense>

        {/* Toast container is client-only (dynamic ssr:false). Kept OUTSIDE
            the Suspense boundary so it doesn't force the entire page tree
            to bail out of SSR — the SSR HTML is what crawlers/AEO bots see. */}
        <LazyToastContainer />

        {/* GTM split into two pieces so we don't need any inline HTML
            with interpolated values:
            1) A tiny static dataLayer init (verifiably safe — no
               user-derived input could ever reach this string).
            2) The full GTM bundle loaded via external src=, deferred
               until after window.onload (lazyOnload). afterInteractive
               (the @next/third-parties default) still loads before the
               load event and shows up in TBT.
            This pattern also keeps the door open to dropping
            'unsafe-inline' from script-src in CSP later. */}
        <Script id="gtm-dl" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        <Script
          id="gtm-loader"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="lazyOnload"
        />

        {/* reCAPTCHA — lazyOnload. The 360 KiB script only matters when a
            form is submitted; deferring past window.onload removes it from
            the critical path. Forms gate submission on grecaptcha.ready()
            so a fast-clicking user gets a brief wait, not a broken submit. */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
