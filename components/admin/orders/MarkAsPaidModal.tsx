'use client'

import React, {useState} from 'react'
import {FaTimes, FaSpinner, FaExclamationTriangle} from 'react-icons/fa'
import {IOrder} from '../../../app-store/types'
import {markOrderAsPaid} from '../../../api/admin/orders.api'

interface MarkAsPaidModalProps {
  order: IOrder
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedOrder: IOrder) => void
}

/**
 * Modal for marking a lead order as paid.
 * Used when payment succeeded but order processing failed.
 *
 * Single Responsibility: Handles the mark as paid form and submission.
 */
export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [paymentId, setPaymentId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!paymentId.trim()) {
      setError('Payment ID is required')
      return
    }

    setIsSubmitting(true)

    try {
      const updatedOrder = await markOrderAsPaid(order.id, {
        razorpay_payment_id: paymentId.trim(),
      })
      onSuccess(updatedOrder)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to mark order as paid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Mark Order #{order.id} as Paid
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isSubmitting}
          >
            <FaTimes className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-4 space-y-4">
            {/* Warning */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <FaExclamationTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 min-w-0">
                <p className="font-medium">Use with caution</p>
                <p className="mt-1 break-words">
                  Only use when payment succeeded in Razorpay but order processing failed.
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{' '}
                {order.user?.firstname || order.user?.email_address}
              </p>
              <p>
                <span className="font-medium">Amount:</span> ₹
                {(order.total_amount || order.amount)?.toLocaleString('en-IN')}
              </p>
              {order.razorpay_order_id && (
                <p>
                  <span className="font-medium">Razorpay Order ID:</span>{' '}
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                    {order.razorpay_order_id}
                  </code>
                </p>
              )}
            </div>

            {/* Payment ID Input */}
            <div>
              <label
                htmlFor="paymentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razorpay Payment ID
              </label>
              <input
                id="paymentId"
                type="text"
                value={paymentId}
                onChange={e => setPaymentId(e.target.value)}
                placeholder="pay_XXXXXXXXXX"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Find this in Razorpay Dashboard → Payments
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !paymentId.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <FaSpinner className="h-4 w-4 animate-spin" />}
              Mark as Paid
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
