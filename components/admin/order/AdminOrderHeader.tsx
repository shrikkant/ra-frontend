import React from 'react'
// import { Button } from "antd";
import {IOrder} from '../../../app-store/types'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {Section} from '../../../app/components/common/Section'
import {FaShippingFast} from 'react-icons/fa'
import {useRentalAgreementAdmin} from '../../../hooks/useRentalAgreementAdmin'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../app-store/auth/auth.slice'

interface AdminOrderHeaderProps {
  order: IOrder
  children?: React.ReactNode
}
export const AdminOrderHeader = ({order, children}: AdminOrderHeaderProps) => {
  const router = useRouter()
  const loggedUser = useSelector(selectAuthState)
  const {hasSignedAgreement, loading: agreementLoading} =
    useRentalAgreementAdmin(loggedUser?.id, order.id)

  const tags = [
    <div key="2" color="purple">
      <Link href={`/p/admin/customers/${order.user.id}`}>
        {order.user.firstname}
      </Link>
    </div>,
  ]

  if (order.invoice) {
    tags.push(
      <div key="3" color="green">
        <Link
          className="p-0"
          href={`/api/admin/orders/${order.id}/invoice`}
          target="_blank"
        >
          Invoice
        </Link>
      </div>,
    )

    // Agreement link
    tags.push(
      <div key="agreement" color="blue">
        {!agreementLoading && hasSignedAgreement ? (
          <Link
            className="p-0"
            href={`/admin/users/${order.user.id}/orders/${order.id}/rental-agreement/signed`}
            target="_blank"
          >
            Agreement
          </Link>
        ) : (
          <span className="text-gray-500">Agreement Sign Pending</span>
        )}
      </div>,
    )

    if (order.delivery_fee_paid > 0) {
      tags.push(
        <div key="4">
          <FaShippingFast />
        </div>,
      )
    }
  }

  return (
    <Section
      title={'#' + order.id}
      tags={tags}
      actions={[
        <button
          className="p-0"
          key="1"
          onClick={() => {
            router.push('/p/admin/orders/' + order.id)
          }}
        >
          Stage
        </button>,
      ]}
    >
      {children}
    </Section>
  )
}
