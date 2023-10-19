import {

  Layout,
  Menu,
  Space,
} from 'antd'

import { Content } from 'antd/lib/layout/layout'
import ProductGrid from '../components/ProductGrid'
import React from 'react'

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
