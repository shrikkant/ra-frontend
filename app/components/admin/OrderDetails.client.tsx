'use client'
import {fetchOrder} from 'api/admin/orders.api'

import React, {useEffect, useState} from 'react'
import {AdminOrderItemRow} from 'components/admin/AdminOrderItemRow'
import Loader from 'components/Loader'
import {OrderStages} from 'util/global.util'
import {OrderStageForm} from 'components/admin/OrderStageForm'

import {OrderDeliveryForm} from 'components/admin/OrderDeilveryForm'
import {IOrder} from 'app-store/types'

interface OrderProps {
  id: number
}
export default function OrderDetails({id}: OrderProps) {
  const [order, setOrder] = useState<IOrder>()
  const [loading, setLoading] = useState(true)

  const [orderChange, setOrderChange] = useState({
    serialNoInfo: [],
    stage: 0,
    id: 0,
  })

  const loadOrder = () => {
    fetchOrder(id).then(data => {
      setOrder(data)
      setOrderChange({...orderChange, id: data?.id, stage: data?.stage})
      setLoading(false)
    })
  }

  useEffect(() => {
    loadOrder()
  }, [order?.stage, id])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4">
          {/* <MyPageHeader
            title={"#" + order.id}

            extra={[
              <Button key="stage_1" type="primary">
                {resolveOrderStage(order.stage)}
              </Button>,
            ]}
          ></MyPageHeader> */}
          {!order ? (
            <Loader />
          ) : (
            <div
              className={
                'border border-gray-500 flex xs:flex-col sm:flex-row items-start justify-start align-top'
              }
              key={order.id}
            >
              <div className="w-3/4">
                {order.items &&
                  order.items.map(item => {
                    return (
                      <AdminOrderItemRow
                        key={item.id}
                        orderItem={item}
                        hideImages
                      />
                    )
                  })}
              </div>
              <div className="xs:flex xs:flex-col">
                {!(order.stage === OrderStages.Leads) && (
                  <OrderStageForm order={order}></OrderStageForm>
                )}

                {order.delivery_fee > 0 && (
                  <div className="p-4">
                    <OrderDeliveryForm order={order} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
