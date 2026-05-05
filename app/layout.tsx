import React, {Suspense} from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import HeaderRouteGate from './components/HeaderRouteGate'
import StoreProvider from './StoreProvider'
import Script from 'next/script'
import {Inter_Tight, JetBrains_Mono} from 'next/font/google'

// CSS imports - ensure proper order.
// Importing the SOURCE tailwind.css lets Next's PostCSS pipeline JIT
// the classes used per route instead of shipping the pre-compiled
// global.css dump (174 KB raw, ~21 KB gzipped, ~80% unused on any
// given page). With this import Next code-splits CSS per route and
// only ships the utilities each route actually uses.
import 'styles/vars.css'
import 'styles/tailwind.css'
import 'styles/common.css'
import 'styles/layout-shift-prevention.css'

import type {Metadata, Viewport} from 'next'
import LazyToastContainer from './components/LazyToastContainer'
import NavigationProgress from './components/common/NavigationProgress'

const GTM_ID = 'GTM-TPF56M8'

// Inter Tight is the LCP-critical font (drives every body/heading paint
// on listing & product pages). `display: 'optional'` keeps LCP at fallback
// paint instead of swap, at the cost of a brief flash of fallback font on
// slow connections — net-positive for Core Web Vitals.
//
// Weight set trimmed to the 4 actually loaded by component classes
// (font-medium / semibold / bold / extrabold). 400 (6 uses) and 900
// (4 uses) fell back imperceptibly to 500/800.
const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'optional',
  weight: ['500', '600', '700', '800'],
  variable: '--font-inter-tight',
})

// JetBrains Mono is only used in small text (kickers, counts) — swap is
// visually fine here.
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
      className={`${interTight.variable} ${jetbrainsMono.variable}`}
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
        {/* Layout no longer wraps the whole tree in one giant Suspense.
            That fallback (a full-page skeleton) was catching suspensions
            from any descendant — including Header sub-nav and listing
            filters that read useSearchParams — and replacing the entire
            page with the skeleton during SSG. The result was zero product
            tiles in prerendered HTML, killing LCP.

            Now each section that may suspend has its own tight boundary:
            - Header / Footer: contain useSearchParams users (sub-nav,
              scripts). Hidden during SSG, revealed at hydration. SSR
              HTML still includes the listing.
            - Listing children: have internal Suspenses around their
              useSearchParams readers (see ListingScreen.tsx). Renders
              with empty params during SSG, hydrates with real params. */}
        <StoreProvider>
          <NavigationProgress />
          <Suspense fallback={null}>
            <HeaderRouteGate>
              <Header />
            </HeaderRouteGate>
          </Suspense>
          <div>{children}</div>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </StoreProvider>

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
          {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`}
        </Script>
        <Script
          id="gtm-loader"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="lazyOnload"
        />

        {/* reCAPTCHA is injected lazily by the useRecaptcha hook on first
            executeRecaptcha() call (see hooks/useRecaptcha.ts). Loading it
            globally afterInteractive cost ~215ms of TBT and 171 KiB of
            unused JS on listing/SEO pages where 99% of visitors never
            trigger Add to Cart. */}
      </body>
    </html>
  )
}
