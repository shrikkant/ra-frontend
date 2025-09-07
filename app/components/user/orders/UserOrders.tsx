'use client'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {IOrder} from '../../../../app-store/types'
import {fetchOrders} from '../../../../api/user/orders.api'
import OrderItemRow from '../../../../components/OrderItemRow'
import Loader from '../../../../components/Loader'
import {Section} from '../../common/Section'
import Link from 'next/link'
import {Button} from '@headlessui/react'
import {ORDER_STEPS, VERIFICATION_FLAGS} from '../../../../config/constants'
import {isVerified} from '../../../../config/constants'

export const UserOrders: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const [orders, setOrders] = useState<IOrder[]>([])
  const actions: React.ReactNode[] = []

  useEffect(() => {
    if (loggedUser) {
      const isAadhaarVerified = isVerified(
        loggedUser?.verified || 0,
        VERIFICATION_FLAGS.AADHAAR,
      )
      setIsAadhaarVerified(isAadhaarVerified)
      fetchOrders().then((data: IOrder[]) => {
        setOrders(data)
      })
    }
  }, [loggedUser])

  return (
    <>
      <div>
        {!orders ? (
          <Loader />
        ) : (
          <div>
            {orders.map((order: IOrder) => (
              <Section
                title={'Order ID: ' + order.id}
                key={order.id}
                tags={[]}
                actions={
                  isAadhaarVerified
                    ? [
                        <Button key={order.id}>
                          <Link href={`/p/orders/${order.id}`} target="_blank">
                            Sign Agreement
                          </Link>
                        </Button>,
                      ]
                    : []
                }
              >
                {order.items &&
                  order.items.map(item => (
                    <OrderItemRow
                      key={item.id}
                      orderItem={item}
                      orderStep={ORDER_STEPS.ORDER_PAID}
                    />
                  ))}
              </Section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
