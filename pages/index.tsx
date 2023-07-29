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

export default function Home() {

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <AppHeader navState={false} onNavStateChange={() => {}}></AppHeader>
      <Content>
        <ProductGrid></ProductGrid>
      </Content>

      <AppFooter></AppFooter>
    </Layout>
  )
}
