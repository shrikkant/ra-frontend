import type { AppProps } from 'next/app'

import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import React, { FC } from 'react';
import Head from 'next/head'
import StoreProvider from '../app/StoreProvider'
import { StatwideScript } from '../app/components/StatwideScript'
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'


const MyApp: FC<AppProps> = ({ Component, ...rest }) => {

  return (
    <StoreProvider>
      <GoogleTagManager gtmId="GTM-TPF56M8" />
      <Head>

        <link rel="shortcut icon" href="/assets/img/rentacross_logo.ico" type="image/x-icon"></link>
        <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="description" content="RentAcross is an online rental platform for cameras, lenses, gopros, insta360 action cameras & camping and adventure gear."></meta>
        <meta name="robots" content="noindex" />

      </Head>
      <Component />
      <StatwideScript />

    </StoreProvider>
  );
}

export default MyApp;
