import React from 'react'
import {Metadata} from 'next'

import {HomeSlider} from '../components/HomeSlider'
import {Testimonial} from '../components/Testimonial'
import {CategorySlider} from '../components/CategorySlider'

import TopSales from '../components/TopSales'
import HomeAdvantages from '../components/home/HomeAdvantages'
import {getFeaturedProducts} from '../api/products.api'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      'Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!',
    other: {
      'application/ld+json': [
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'RentAcross',
          url: 'https://rentacross.com',
          logo: 'https://rentacross.com/assets/v2/img/logo.png',
          description:
            "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
          sameAs: [
            'https://www.facebook.com/rentacross',
            'https://www.instagram.com/rentacross',
            'https://twitter.com/rentacross',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-7720829444',
            contactType: 'customer service',
            areaServed: ['IN'],
            availableLanguage: ['English', 'Hindi', 'Marathi'],
          },
        }),
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'RentAcross',
          url: 'https://rentacross.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://rentacross.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }),
      ],
    },
  }
}

export default async function Home() {
  const categories = await getFeaturedProducts(8, 'pune')

  return (
    <>
      <HomeSlider></HomeSlider>
      <CategorySlider></CategorySlider>
      <HomeAdvantages></HomeAdvantages>
      <TopSales categories={categories}></TopSales>
      <Testimonial></Testimonial>
    </>
  )
}
