import React from 'react'
import {Metadata} from 'next'

export const revalidate = 3600

import {HomeBanner} from '../components/HomeBanner'
import {ReviewsSection} from '../components/ReviewsSection'
import {CategorySlider} from '../components/CategorySlider'
import TopSales from '../components/TopSales'
import HomeFAQ from '../components/home/HomeFAQ'
import StickyMobileCTA from '../components/home/StickyMobileCTA'
import {faqs} from '../components/home/faq-data'
import {getFeaturedProductsServer} from '../api/products.api'
import {fetchStaticData} from './utils/api'

export async function generateMetadata(): Promise<Metadata> {
  const title =
    'Rent Cameras, Lenses & Photography Gear | Starting ₹450/day — RentAcross'
  const description =
    'Rent DSLR, mirrorless cameras, lenses, lights & GoPros in Pune. Same-day doorstep delivery, zero deposit hassle, 1500+ happy customers. Sony, Canon & Nikon gear at affordable daily rates.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      siteName: 'RentAcross',
      url: 'https://rentacross.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: 'https://rentacross.com',
    },
  }
}

function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RentAcross',
    description:
      'Camera and photography equipment rental service in Pune. Rent DSLR, mirrorless cameras, lenses, lights and action cameras at affordable daily rates with doorstep delivery.',
    url: 'https://rentacross.com',
    telephone: '+91-9112005954',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1500',
      bestRating: '5',
    },
    priceRange: '₹450 - ₹3000/day',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RentAcross',
    url: 'https://rentacross.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://rentacross.com/pune/rent-camera?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
      />
    </>
  )
}

export default async function Home() {
  const categories = await getFeaturedProductsServer(8, 'pune')
  const staticCategories = await fetchStaticData('categories')

  return (
    <>
      <JsonLd />
      <main>
        <HomeBanner
          city="pune"
          category="rent-camera"
          categories={staticCategories}
        />
        <CategorySlider />
        <TopSales categories={categories} />
        <ReviewsSection />
        <HomeFAQ />
        <StickyMobileCTA href="/pune/rent-camera?q=" />
      </main>
    </>
  )
}
