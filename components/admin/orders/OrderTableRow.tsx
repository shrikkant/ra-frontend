'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {format} from 'date-fns'
import {
  FaShippingFast,
  FaFileInvoice,
  FaFileContract,
  FaCreditCard,
  FaTag,
} from 'react-icons/fa'
import {IOrder, IOrderItem} from '../../../app-store/types'
import {useRentalAgreementAdmin} from '../../../hooks/useRentalAgreementAdmin'
import {openPdfInNewWindow} from '../../../util/pdf.util'
import {resolveOrderStage, formatCurrency} from '../../../util/global.util'
import dynamic from 'next/dynamic'

const MarkAsPaidModal = dynamic(() => import('./MarkAsPaidModal').then(m => m.MarkAsPaidModal), {ssr: false})
const ApplyDiscountModal = dynamic(() => import('./ApplyDiscountModal').then(m => m.ApplyDiscountModal), {ssr: false})

interface OrderTableRowProps {
  order: IOrder
  onOrderUpdate?: (updatedOrder: IOrder) => void
}

interface ProductSummaryProps {
  items: IOrderItem[]
}

/**
 * Displays a compact summary of products in an order.
 * Single Responsibility: Only renders product summary.
 */
const ProductSummary: React.FC<ProductSummaryProps> = ({items}) => {
  if (!items || items.length === 0) {
    return <span className="text-gray-400">No items</span>
  }

  const firstItem = items[0]
  const remainingCount = items.length - 1

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-gray-900 truncate max-w-48">
        {firstItem.product?.title || 'Unknown Product'}
      </span>
      {remainingCount > 0 && (
        <span className="text-xs text-amber-600">
          +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

/**
 * Formats a date for display.
 */
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-'
  try {
    return format(new Date(date), 'dd MMM')
  } catch {
    return '-'
  }
}

/**
 * Formats currency amount, returning '-' for missing values.
 */
const formatAmount = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '-'
  return formatCurrency(amount)
}

/**
 * Order table row component for spreadsheet view.
 * Displays one order as a table row with key information.
 *
 * Single Responsibility: Renders a single order row.
 */
export const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onOrderUpdate,
}) => {
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const {pdfUrl, hasSignedAgreement, loading: agreementLoading, fetchAgreement} =
    useRentalAgreementAdmin(order.user?.id, order.id, {lazy: true})

  const handleViewAgreement = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (pdfUrl) {
      openPdfInNewWindow(pdfUrl, `${order.id}-rental-agreement.pdf`)
      return
    }
    const url = await fetchAgreement()
    if (url) {
      openPdfInNewWindow(url, `${order.id}-rental-agreement.pdf`)
    }
  }

  const handleMarkAsPaidSuccess = (updatedOrder: IOrder) => {
    if (onOrderUpdate) {
      onOrderUpdate(updatedOrder)
    }
  }

  const customerName =
    order.user?.firstname ||
    order.user?.email_address?.split('@')[0] ||
    'Unknown'

  const isLead = order.stage === 0

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      {/* Order ID */}
      <td className="px-3 py-3 whitespace-nowrap">
        <Link
          href={`/p/admin/orders/${order.id}`}
          className="text-sm font-medium text-amber-600 hover:text-amber-800"
        >
          #{order.id}
        </Link>
      </td>

      {/* Customer */}
      <td className="px-3 py-3 whitespace-nowrap">
        <Link
          href={`/p/admin/customers/${order.user?.id}`}
          className="text-sm text-gray-900 hover:text-amber-600"
        >
          {customerName}
        </Link>
        {order.user?.phone && (
          <div className="text-xs text-gray-500">{order.user.phone}</div>
        )}
      </td>

      {/* City */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="text-sm text-gray-600">
          {order.user?.city || '-'}
        </span>
      </td>

      {/* Products */}
      <td className="px-3 py-3">
        <ProductSummary items={order.items || []} />
      </td>

      {/* Start Date */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="text-sm text-gray-900 font-medium">
          {formatDate(order.start_date)}
        </span>
      </td>

      {/* End Date */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="text-sm text-gray-900 font-medium">
          {formatDate(order.end_date)}
        </span>
      </td>

      {/* Days */}
      <td className="px-3 py-3 whitespace-nowrap text-center">
        <span className="text-sm text-gray-600">{order.days || '-'}</span>
      </td>

      {/* Amount */}
      <td className="px-3 py-3 whitespace-nowrap text-right">
        <span className="text-sm font-medium text-gray-900">
          {formatAmount(order.total_amount || order.amount)}
        </span>
        {order.applied_discount && order.applied_discount > 0 && (
          <div className="text-xs text-green-600">
            -{formatAmount(order.applied_discount)}
          </div>
        )}
      </td>

      {/* Stage */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            order.stage === 0
              ? 'bg-yellow-100 text-yellow-800'
              : order.stage === 1
                ? 'bg-blue-100 text-blue-800'
                : order.stage === 3
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          {resolveOrderStage(order.stage)}
        </span>
      </td>

      {/* Actions/Icons */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {/* Apply Discount - only for leads (stage 0) */}
          {isLead && (
            <button
              onClick={() => setShowDiscountModal(true)}
              className="text-purple-600 hover:text-purple-800"
              title="Apply Discount"
            >
              <FaTag className="h-4 w-4" />
            </button>
          )}

          {/* Mark as Paid - only for leads (stage 0) */}
          {isLead && (
            <button
              onClick={() => setShowMarkAsPaidModal(true)}
              className="text-green-600 hover:text-green-800"
              title="Mark as Paid"
            >
              <FaCreditCard className="h-4 w-4" />
            </button>
          )}

          {/* Invoice - only for paid (1) and in progress (3) orders */}
          {order.invoice && order.stage >= 1 ? (
            <Link
              href={`/api/admin/orders/${order.id}/invoice`}
              target="_blank"
              className="text-gray-400 hover:text-amber-600"
              title="View Invoice"
            >
              <FaFileInvoice className="h-4 w-4" />
            </Link>
          ) : (
            <span className="text-gray-200" title="Invoice not available">
              <FaFileInvoice className="h-4 w-4" />
            </span>
          )}

          {/* Agreement */}
          {hasSignedAgreement && pdfUrl ? (
            <button
              onClick={handleViewAgreement}
              className="text-gray-400 hover:text-blue-600"
              title="View Agreement"
            >
              <FaFileContract className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleViewAgreement}
              disabled={agreementLoading}
              className={`${agreementLoading ? 'text-gray-300 animate-pulse' : 'text-gray-400 hover:text-blue-600'}`}
              title="Check Agreement"
            >
              <FaFileContract className="h-4 w-4" />
            </button>
          )}

          {/* Delivery */}
          {order.delivery_fee_paid > 0 && (
            <span className="text-amber-500" title="Has Delivery">
              <FaShippingFast className="h-4 w-4" />
            </span>
          )}
        </div>

        {/* Apply Discount Modal */}
        <ApplyDiscountModal
          order={order}
          isOpen={showDiscountModal}
          onClose={() => setShowDiscountModal(false)}
          onSuccess={() => onOrderUpdate && onOrderUpdate(order)}
        />

        {/* Mark as Paid Modal */}
        <MarkAsPaidModal
          order={order}
          isOpen={showMarkAsPaidModal}
          onClose={() => setShowMarkAsPaidModal(false)}
          onSuccess={handleMarkAsPaidSuccess}
        />
      </td>
    </tr>
  )
}
