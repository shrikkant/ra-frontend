import {

  Layout,
  Menu,
  Space,
} from 'antd'

import { Content } from 'antd/lib/layout/layout'
import ProductGrid from '../components/ProductGrid'
import React, { useEffect, useState } from 'react'

import { AppLayout } from '../components/AppLayout'

import { HomeSlider } from '../components/HomeSlider'
import { IHomeSlide } from '../app-store/products/types'
import { useRouter } from 'next/router'
import { Testimonial } from '../components/Testimonial'
import Header from '../components/common/Header'


import Footer from '../components/common/Footer'
import TopSales from '../components/home/TopSales'


export default async function Home() {
  // new
  return (<>
    <div>

      <Header></Header>

      <div>

        <HomeSlider></HomeSlider>



        <section className="s-find-bike">
          <div className="container">
            <form className="find-bike-form">
              <h2 className="title">find the bike</h2>
              <ul className="form-wrap">
                <li>
                  <label>What?</label>
                  <select className="nice-select">
                    <option >Cameras</option>
                    <option>GoPros</option>
                    <option>Camping Gear</option>
                  </select>
                </li>
                <li><a href="shop.html" className="btn"><span>search</span></a></li>
              </ul>
            </form>
          </div>
        </section>

        <section className="s-category-bicycle">
          <div className="container">
            <div className="slider-categ-bicycle">
              <div className="slide-categ-bicycle">
                <div className="categ-bicycle-item">
                  <img src="assets/v2/img/categ-2.png" alt="category" />
                  <div className="categ-bicycle-info">
                    <h4 className="title">mountain & road bikes</h4>
                    <a href="shop.html" className="btn"><span>view more</span></a>
                  </div>
                </div>
              </div>
              <div className="slide-categ-bicycle">
                <div className="categ-bicycle-item">
                  <img src="assets/v2/img/categ-3.png" alt="category" />
                  <div className="categ-bicycle-info">
                    <h4 className="title">bicycle spare parts</h4>
                    <a href="shop.html" className="btn"><span>view more</span></a>
                  </div>
                </div>
              </div>
              <div className="slide-categ-bicycle">
                <div className="categ-bicycle-item">
                  <img src="assets/v2/img/categ-1.png" alt="category" />
                  <div className="categ-bicycle-info">
                    <h4 className="title">accessories & clothing</h4>
                    <a href="shop.html" className="btn"><span>view more</span></a>
                  </div>
                </div>
              </div>
              <div className="slide-categ-bicycle">
                <div className="categ-bicycle-item">
                  <img src="assets/v2/img/categ-3.png" alt="category" />
                  <div className="categ-bicycle-info">
                    <h4 className="title">bicycle spare parts</h4>
                    <a href="shop.html" className="btn"><span>view more</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="s-our-advantages" style={{ backgroundImage: 'url(assets/v2/img/bg-advantages.jpg)' }} >
          <span className="mask"></span>
          <div className="container">
            <h2 className="title">Our Advantages</h2>
            <div className="our-advantages-wrap">
              <div className="our-advantages-item">
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-1.svg" alt="icon" />
                <h5>Free shipping from $500</h5>
              </div>
              <div className="our-advantages-item">
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-2.svg" alt="icon" />
                <h5>Warranty service for 3 months</h5>
              </div>
              <div className="our-advantages-item">
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-3.svg" alt="icon" />
                <h5>Exchange and return within 14 days</h5>
              </div>
              <div className="our-advantages-item">
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-4.svg" alt="icon" />
                <h5>Discounts for customers</h5>
              </div>
            </div>
          </div>
        </section>
        <TopSales></TopSales>


        <Testimonial></Testimonial>


        <Footer></Footer>
      </div>
    </div>
  </>)



  // old
  // return (
  //   <AppLayout sidebar={false}>
  //     <Content>
  //       <ProductGrid></ProductGrid>
  //     </Content>
  //   </AppLayout>
  // )
}
