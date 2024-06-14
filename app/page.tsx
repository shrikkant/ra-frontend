import React, { useEffect, useState } from 'react'

import { HomeSlider } from '../components/HomeSlider'
import { Testimonial } from '../components/Testimonial'
import Header from '../components/common/Header'


import Footer from '../components/common/Footer'
import TopSales from '../components/home/TopSales'
import HomeAdvantages from '../components/home/HomeAdvantages'
import SearchGear from '../components/home/SearchGear'


export default async function Home() {
  // new
  return (<>
    <div>

      <Header></Header>

      <div>
        <HomeSlider></HomeSlider>
        <SearchGear></SearchGear>

        <HomeAdvantages></HomeAdvantages>

        <TopSales></TopSales>
        <Testimonial></Testimonial>
        <Footer></Footer>
      </div>
    </div>
  </>)
}
