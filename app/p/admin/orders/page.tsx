import React from 'react'
import {OrdersSpreadsheet} from '../../../../components/admin/orders'
import {ORDER_TABS} from '../../../../components/admin/orders/orderTabs'

type SearchParams = Promise<{[key: string]: string | string[] | undefined}>

export default async function Page(props: {searchParams: SearchParams}) {
  const searchParams = await props.searchParams
  const stageIndex = searchParams.stage
    ? parseInt(String(searchParams.stage))
    : 0
  const stage = ORDER_TABS[stageIndex]?.stage ?? ORDER_TABS[0].stage
  return <OrdersSpreadsheet initialStage={stage} />
}
