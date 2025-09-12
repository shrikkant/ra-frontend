import React from 'react'

import OrderDetails from '../../../components/user/orders/OrderDetails.client'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Page({params}: Props) {
  const localParams = await params

  return <OrderDetails id={parseInt(localParams.id)} />
}
