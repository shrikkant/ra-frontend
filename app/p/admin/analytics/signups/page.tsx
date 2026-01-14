'use client'

import dynamic from 'next/dynamic'

const SignupAnalytics = dynamic(
  () => import('../../../../components/admin/SignupAnalytics.client'),
  {ssr: false, loading: () => <div className="h-[300px] animate-pulse bg-gray-100 rounded" />}
)

export default function Page() {
  return <SignupAnalytics />
}
