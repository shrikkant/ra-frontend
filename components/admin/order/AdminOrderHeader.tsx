import React from 'react'
// import { Button } from "antd";
import {IOrder} from '../../../app-store/types'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {Section} from '../../../app/components/common/Section'
import {FaShippingFast} from 'react-icons/fa'
import {useRentalAgreementAdmin} from '../../../hooks/useRentalAgreementAdmin'

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
      // If it's a data URL, convert it to a blob URL for better compatibility
      if (pdfUrl.startsWith('data:')) {
        // Convert data URL to blob
        fetch(pdfUrl)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob)
            const newWindow = window.open(blobUrl, '_blank')

            // Clean up the blob URL after a delay
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl)
            }, 1000)

            // If window didn't open, try fallback
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed === 'undefined'
            ) {
              // Create download link as fallback
              const link = document.createElement('a')
              link.href = blobUrl
              link.download = 'rental-agreement.pdf'
              link.click()
            }
          })
          .catch(err => {
            console.error('Failed to open PDF:', err)
            // Fallback: try opening data URL directly
            window.open(pdfUrl, '_blank')
          })
      } else {
        // Regular URL, open directly
        window.open(pdfUrl, '_blank')
      }
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
