import React from 'react'
// import { Button } from "antd";
import {IOrder} from '../../../app-store/types'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {Section} from '../../../app/components/common/Section'
import {FaShippingFast} from 'react-icons/fa'
import {useRentalAgreementAdmin} from '../../../hooks/useRentalAgreementAdmin'
import {openPdfInNewWindow} from '../../../util/pdf.util'

interface AdminOrderHeaderProps {
  order: IOrder
  children?: React.ReactNode
}
export const AdminOrderHeader = ({order, children}: AdminOrderHeaderProps) => {
  const router = useRouter()

  const {
    pdfUrl,
    hasSignedAgreement,
    loading: agreementLoading,
  } = useRentalAgreementAdmin(order.user.id, order.id)

  const handleViewAgreement = () => {
    if (pdfUrl) {
      openPdfInNewWindow(pdfUrl, order.id + '-rental-agreement.pdf')
    }
  }

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
        {!agreementLoading && hasSignedAgreement && pdfUrl ? (
          <button
            className="p-0 text-blue-600 hover:text-blue-800"
            onClick={handleViewAgreement}
          >
            Agreement
          </button>
        ) : (
          <span className="text-gray-500">Not Signed</span>
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
