import type { AppProps } from 'next/app'

import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import React, { FC } from 'react';
import Head from 'next/head'
import StoreProvider from '../app/StoreProvider'


const MyApp: FC<AppProps> = ({ Component, ...rest }) => {

  return (
    <StoreProvider>
      <Head>

        <link rel="shortcut icon" href="/assets/img/rentacross_logo.ico" type="image/x-icon"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="description" content="RentAcross is an online rental platform for cameras, lenses, gopros, insta360 action cameras & camping and adventure gear."></meta>
        <meta name="robots" content="noindex" />

      </Head>
      <Component />
    </StoreProvider>
  );
}

export default MyApp;
