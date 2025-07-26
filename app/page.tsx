import React from 'react'
import {Metadata} from 'next'

import {HomeBanner} from '../components/HomeBanner'
import {ReviewsSection} from '../components/ReviewsSection'
import {CategorySlider} from '../components/CategorySlider'

import TopSales from '../components/TopSales'
import HomeAdvantages from '../components/home/HomeAdvantages'
import {getFeaturedProductsServer} from '../api/server-fetch'
import {ENV_CONFIG} from '../config/environment'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      'Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!',
  }
}

export default async function Home() {
  // Log environment configuration on server-side
  // console.log('🌍 Environment Configuration (Server-Side - Home Page):', {
  //   CLIENT_API_BASE_URL: ENV_CONFIG.CLIENT_API_BASE_URL,
  //   CLIENT_API_V1_URL: ENV_CONFIG.CLIENT_API_V1_URL,
  //   SERVER_API_BASE_URL: ENV_CONFIG.SERVER_API_BASE_URL,
  //   SERVER_API_V1_URL: ENV_CONFIG.SERVER_API_V1_URL,
  //   SERVER_DIGILOCKER_API_URL: ENV_CONFIG.SERVER_DIGILOCKER_API_URL,
  //   BASE_URL: ENV_CONFIG.BASE_URL,
  //   BASE_URL_WWW: ENV_CONFIG.BASE_URL_WWW,
  //   NODE_ENV: ENV_CONFIG.NODE_ENV,
  //   IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
  //   IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
  // })

  const categories = await getFeaturedProductsServer(8, 'pune')

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
