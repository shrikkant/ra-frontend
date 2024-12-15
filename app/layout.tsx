

import React, { Suspense } from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../styles/global.css'
import StoreProvider from './StoreProvider'

import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import type { Viewport } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {

  // const categories: IProductCategory[] = await fetchData('categories');

  return (
    <html lang="en">
      <head>
        <title>RentAcross | Rent Cameras, Lenses, GoPros.</title>
        <meta property="og:title" content="Rent DSLR Cameras, Lenses & GoPro's. India's First Camera Rental Community" key="title" />

        <meta property="og:site_name" content="RentAcross" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow"></meta>
        <meta property="og:url" content="https://www.rentacross.com" />

        <meta name="description"
          content="Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. Perfect for beginners and professionals.
          Easy booking, flexible plans—rent the gear you need today!" />
        <meta name="keywords"
          content="Rent DSLR Cameras, Rent GoPro, Rent Video Cameras, Rent DSLR Lenses, Camera Rental Community, Online Camera Rental Store" />
        <link rel="stylesheet" href="/assets/v2/css/slick.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/font-awesome.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/nice-select.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
        <meta name="google-site-verification" content="bk-pBKeRJOZYfiWkLC927Y2SVdFADUPUcVrtXVgh4tQ" />
        <GoogleTagManager gtmId="GTM-TPF56M8" />
      </head>

      <body>


        <Suspense fallback={<div className="preloader-cover">
          <div className="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>}>
          <StoreProvider>
            <Header />
            {children}
            <Footer />
          </StoreProvider>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </Suspense>
      </body>
    </html>
  )
}
