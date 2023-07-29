import {

  Layout,
  Menu,
  Space,
} from 'antd'
import type { DatePickerProps } from 'antd'

import { Content } from 'antd/lib/layout/layout'
import AppHeader from '../components/header'
import ProductGrid from '../components/ProductGrid'
import { AppFooter } from '../components/footer'
import React from 'react'

import styles from "../styles/Home.module.css";
import { AppLayout } from '../components/AppLayout'

export default function Home() {

  return (
    <AppLayout sidebar={false}>
      <Content>
        <ProductGrid></ProductGrid>
      </Content>
    </AppLayout>
  )
}
