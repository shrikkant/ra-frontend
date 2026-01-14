'use client'

import dynamic from 'next/dynamic'

const OrderAnalytics = dynamic(
  () => import('../../../../components/admin/OrderAnalytics.client'),
  {ssr: false, loading: () => <div className="h-[300px] animate-pulse bg-gray-100 rounded" />}
)

export default function Page() {
  return <OrderAnalytics />
}
