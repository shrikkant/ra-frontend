import React from 'react'
import CustomerDetails from '../../../../components/admin/CustomerDetails.client'

type Params = Promise<{id: string}>

export default async function Page(props: {params: Params}) {
  const params = await props.params

  return <CustomerDetails id={params.id} />
}
