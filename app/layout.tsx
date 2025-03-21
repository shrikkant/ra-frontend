

import React, { Suspense } from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../styles/global.css'
import StoreProvider from './StoreProvider'

// import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import type { Metadata, Viewport } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface PageProps {
  params: unknown
}

interface IOpenImage {
  url: string,
  alt: string,
}

interface IMetadata {
  title: string,
  description: string
  openGraph?: {
    title: string,
    description: string,
    url: string,
    siteName: string,
    images: IOpenImage[],
    type: string,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = "Top-Quality Camera Rentals – Shoot Without Limits";
  const description =
    "Get high-quality cameras, lenses, and accessories on rent." +
    "Flexible rental plans, top brands, and easy booking for photographers, filmmakers, and content creators. Shoot without limits! "
  const metadata: IMetadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.rentacross.com",
      images: [{
        url: "https://www.rentacross.com/assets/v2/img/rentacross-camera-rental.webp",
        alt: "Top-Quality Camera Rentals – Shoot Without Limits"
      },
      {
        url: "https://www.rentacross.com/assets/v2/img/rentacross-camera-rental-1.webp",
        alt: "Capture More, Spend Less – Rent Cameras & Gear"
      }, {
        url: "https://www.rentacross.com/assets/v2/img/rentacross-camera-rental-2.webp",
        alt: "Rent. Shoot. Create. Hassle-Free Camera Rentals"
      },
      {
        url: "https://www.rentacross.com/assets/v2/img/rentacross-camera-rental-3.webp",
        alt: "Shoot Like a Pro – Rent Cameras & Lenses with Ease"
      }
      ],
      type: "website",
      siteName: "RentAcross"
    }
  }

  return metadata;
}

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

        <meta name="robots" content="index, follow"></meta>

        <meta name="keywords"
          content="Rent DSLR Cameras, Rent GoPro, Rent Video Cameras, Rent DSLR Lenses, Camera Rental Community, Online Camera Rental Store" />
        <link rel="stylesheet" href="/assets/v2/css/slick.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/font-awesome.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/nice-select.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
        <meta name="google-site-verification" content="bk-pBKeRJOZYfiWkLC927Y2SVdFADUPUcVrtXVgh4tQ" />

        <GoogleTagManager gtmId="GTM-TPF56M8" />

        <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
        <script type="text/javascript" id="vwoCode"
          dangerouslySetInnerHTML={{
            __html: `window._vwo_code || (function() {
var account_id=1026829,
version=2.1,
settings_tolerance=2000,
hide_element='body',
hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important;',
/* DO NOT EDIT BELOW THIS LINE */
f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={nonce:v&&v.nonce,use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){if(performance.getEntriesByName('first-contentful-paint')[0]){return''}return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById('_vis_opt_path_hides');if(t)t.parentNode.removeChild(t);if(e)(new Image).src='https://dev.visualwebsiteoptimizer.com/ee.gif?a='+account_id+e}},finished:function(){return f},addScript:function(e){var t=d.createElement('script');t.type='text/javascript';if(e.src){t.src=e.src}else{t.text=e.text}v&&t.setAttribute('nonce',v.nonce);d.getElementsByTagName('head')[0].appendChild(t)},load:function(e,t){var n=this.getSettings(),i=d.createElement('script'),r=this;t=t||{};if(n){i.textContent=n;d.getElementsByTagName('head')[0].appendChild(i);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open('GET',e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||'text';o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200||o.status===304){w._vwo_code.addScript({text:o.responseText})}else{w._vwo_code.finish('&e=loading_failure:'+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}w._vwo_code.finish('&e=loading_failure:'+e)};o.send()}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){w._vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=='body'){t=d.createElement('style');var n=this.hide_element(),i=n?n+this.hide_element_style():'',r=d.getElementsByTagName('head')[0];t.setAttribute('id','_vis_opt_path_hides');v&&t.setAttribute('nonce',v.nonce);t.setAttribute('type','text/css');if(t.styleSheet)t.styleSheet.cssText=i;else t.appendChild(d.createTextNode(i));r.appendChild(t)}else{t=d.getElementsByTagName('head')[0];var i=d.createElement('div');i.style.cssText='z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;display: block !important;';i.setAttribute('id','_vis_opt_path_hides');i.classList.add('_vis_hide_layer');t.parentNode.insertBefore(i,t.nextSibling)}var o=window._vis_opt_url||d.URL,s='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(o)+'&vn='+version;if(w.location.search.indexOf('_vwo_xhr')!==-1){this.addScript({src:s})}else{this.load(s+'&x=true')}}};w._vwo_code=code;code.init();})();(function(){var i=window;function t(){if(i._vwo_code){var e=t.hidingStyle=document.getElementById('_vis_opt_path_hides')||t.hidingStyle;if(!i._vwo_code.finished()&&!_vwo_code.libExecuted&&(!i.VWO||!VWO.dNR)){if(!document.getElementById('_vis_opt_path_hides')){document.getElementsByTagName('head')[0].appendChild(e)}requestAnimationFrame(t)}}}t()})();`
          }}
        />

      </head>

      <body>
        <div className="preloader-cover">
          <div className="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

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
            <div className="px-2">
              {children}
            </div>
            <Footer />
          </StoreProvider>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </Suspense>
      </body>
    </html>
  )
}
