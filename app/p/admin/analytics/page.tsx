'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import {TabGroup, TabPanel, TabPanels} from '@headlessui/react'
import {PillTabList} from '../../../../components/common/PillTabs'

// Dynamically import heavy chart components to reduce initial bundle
const Analytics = dynamic(
  () => import('../../../components/admin/Analytics.client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] animate-pulse bg-gray-100 rounded" />
    ),
  },
)

const OrderAnalytics = dynamic(
  () => import('../../../components/admin/OrderAnalytics.client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] animate-pulse bg-gray-100 rounded" />
    ),
  },
)

const SignupAnalytics = dynamic(
  () => import('../../../components/admin/SignupAnalytics.client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] animate-pulse bg-gray-100 rounded" />
    ),
  },
)

export default function Page() {
  return (
    <>
      <div className="pt-8">
        <TabGroup>
          <PillTabList tabs={['Products', 'Revenue', 'Signups']} />
          <TabPanels>
            <TabPanel>
              <Analytics />
            </TabPanel>
            <TabPanel>
              <OrderAnalytics />
            </TabPanel>
            <TabPanel>
              <SignupAnalytics />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </>
  )
}
