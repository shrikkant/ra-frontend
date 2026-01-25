import React from 'react'
import {OrdersSpreadsheet} from '../../../../components/admin/orders'

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>

const ORDER_STAGES = [0, 1, 3]

export default async function Page(props: {searchParams: SearchParams}) {
  const searchParams = await props.searchParams
  const stageIndex = searchParams.stage ? parseInt(String(searchParams.stage)) : 0
  const stage = ORDER_STAGES[stageIndex] ?? 0
  return <OrdersSpreadsheet initialStage={stage} />
}
