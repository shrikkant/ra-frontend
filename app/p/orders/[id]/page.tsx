/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import OrderDetails from '../../../components/user/orders/OrderDetails.client'

interface Props {
  params: any
}

export default async function Page({params}: Props) {
  const localParams = await params

  return <OrderDetails id={localParams.id} />
}
