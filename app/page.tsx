import React from 'react'
import {Metadata} from 'next'

import {HomeBanner} from '../components/HomeBanner'
import {ReviewsSection} from '../components/ReviewsSection'
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
  }
}

export default async function Home() {
  const categories = await getFeaturedProducts(8, 'pune')

  return (
    <>
      <HomeBanner />

      <CategorySlider></CategorySlider>
      <HomeAdvantages></HomeAdvantages>
      <TopSales categories={categories}></TopSales>
      <ReviewsSection></ReviewsSection>
    </>
  )
}
