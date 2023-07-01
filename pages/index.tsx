import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Slider,
  Card,
  Switch,
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
      <AppHeader></AppHeader>
      <Content className={styles.container}>
        <ProductGrid></ProductGrid>
      </Content>

      <AppFooter></AppFooter>
    </Layout>
  )
}
