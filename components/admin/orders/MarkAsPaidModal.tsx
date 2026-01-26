'use client'

import React, {useState} from 'react'
import {
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import {IOrder} from '../../../app-store/types'
import {
  markOrderAsPaid,
  verifyPayment,
  PaymentVerificationResult,
} from '../../../api/admin/orders.api'
import {formatCurrency} from '../../../util/global.util'

interface MarkAsPaidModalProps {
  order: IOrder
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedOrder: IOrder) => void
}

interface PaymentDetailsProps {
  verification: PaymentVerificationResult
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({verification}) => {
  const {payment, amountMatches} = verification

  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-md space-y-2">
      <div className="flex items-center gap-2 text-green-800">
        <FaCheckCircle className="h-4 w-4" />
        <span className="font-medium text-sm">Payment Verified</span>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Amount:</span>{' '}
          {formatCurrency(payment.amount)}
          {!amountMatches && (
            <span className="ml-2 text-red-600 text-xs font-medium">
              (Mismatch!)
            </span>
          )}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span className="text-green-700">{payment.status}</span>
        </p>
        <p>
          <span className="font-medium">Method:</span> {payment.method}
        </p>
        {payment.email && (
          <p>
            <span className="font-medium">Email:</span> {payment.email}
          </p>
        )}
        {payment.contact && (
          <p>
            <span className="font-medium">Phone:</span> {payment.contact}
          </p>
        )}
      </div>
    </div>
  )
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [paymentId, setPaymentId] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verification, setVerification] =
    useState<PaymentVerificationResult | null>(null)

  if (!isOpen) return null

  const handleVerify = async () => {
    if (!paymentId.trim()) {
      setError('Payment ID is required')
      return
    }

    setError(null)
    setVerification(null)
    setIsVerifying(true)

    try {
      const result = await verifyPayment(order.id, paymentId.trim())
      setVerification(result)

      if (!result.amountMatches) {
        setError(
          `Amount mismatch: Order ${formatCurrency(result.order.amount)}, Payment ${formatCurrency(result.payment.amount)}`,
        )
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to verify payment')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verification) {
      setError('Please verify the payment first')
      return
    }

    if (!verification.amountMatches) {
      setError('Cannot proceed: Payment amount does not match order amount')
      return
    }

    setError(null)
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

  const handleClose = () => {
    setPaymentId('')
    setVerification(null)
    setError(null)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handlePaymentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentId(e.target.value)
    setVerification(null)
    setError(null)
  }

  const canSubmit =
    verification?.valid && verification?.amountMatches && !isSubmitting

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
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isSubmitting}
          >
            <FaTimes className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-4 space-y-4">
            {/* Order Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{' '}
                {order.user?.firstname || order.user?.email_address}
              </p>
              <p>
                <span className="font-medium">Order Amount:</span>{' '}
                {formatCurrency(order.total_amount || order.amount)}
              </p>
            </div>

            {/* Payment ID Input with Verify Button */}
            <div>
              <label
                htmlFor="paymentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razorpay Payment ID
              </label>
              <div className="flex gap-2">
                <input
                  id="paymentId"
                  type="text"
                  value={paymentId}
                  onChange={handlePaymentIdChange}
                  placeholder="pay_XXXXXXXXXX"
                  className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  disabled={isVerifying || isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!paymentId.trim() || isVerifying || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isVerifying && <FaSpinner className="h-3 w-3 animate-spin" />}
                  Verify
                </button>
              </div>
            </div>

            {/* Verification Result */}
            {verification && <PaymentDetails verification={verification} />}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <FaTimesCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <FaSpinner className="h-4 w-4 animate-spin" />}
              Confirm & Mark Paid
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
