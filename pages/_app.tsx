import type { AppProps } from 'next/app'
import { store } from '../app-store/store'
import "antd/dist/reset.css"
import 'styles/vars.css'
import 'styles/global.css'
import 'styles/common.css'

import React, { FC } from 'react';
import { Provider } from 'react-redux'
import Head from 'next/head'

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {

  return (
      <Provider store={store}>
        <Head>

        <link rel="shortcut icon" href="/assets/img/rentacross_logo.ico" type="image/x-icon"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="description" content="RentAcross is an online rental platform for cameras, lenses, gopros, insta360 action cameras & camping and adventure gear."></meta>
        <meta name="robots" content="noindex" />

        </Head>
        <Component/>
      </Provider>
  );
}

export default MyApp;
