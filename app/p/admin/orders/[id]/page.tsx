import React from 'react'
import OrderDetails from '../../../../components/admin/OrderDetails.client'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Page({params}: Props) {
  const localParams = await params
  const orderId = parseInt(localParams.id)

  return <OrderDetails id={orderId} />
}
