import React from 'react'

import { HomeSlider } from '../components/HomeSlider'
import { Testimonial } from '../components/Testimonial'

import TopSales from '../components/TopSales'
import HomeAdvantages from '../components/home/HomeAdvantages'
import HowItWorks from '../components/home/HowItWorks'

import { getFeaturedProducts } from '../api/products.api'


export default async function Home() {

  const categories = await getFeaturedProducts(8, "pune");
  // new
  return (<>

    <HomeSlider></HomeSlider>


   {/* <HomeAdvantages></HomeAdvantages> */}
    <HowItWorks></HowItWorks>

    <TopSales categories={categories}></TopSales>
    <Testimonial></Testimonial>


  </>)  
}
