import React, { useEffect, useState } from 'react'

import { HomeSlider } from '../components/HomeSlider'
import { Testimonial } from '../components/Testimonial'

import TopSales from '../components/TopSales'
import HomeAdvantages from '../components/home/HomeAdvantages'
import SearchGear from '../components/home/SearchGear'
import { getFeaturedProducts } from '../api/products.api'


export default async function Home() {

  const categories = await getFeaturedProducts(4, "pune");
  // new
  return (<>

    <HomeSlider></HomeSlider>
    <SearchGear></SearchGear>

    <HomeAdvantages></HomeAdvantages>

    <TopSales categories={categories}></TopSales>
    <Testimonial></Testimonial>


  </>)
}
