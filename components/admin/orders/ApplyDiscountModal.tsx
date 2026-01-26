'use client'

import React, {useState} from 'react'
import {FaTimes, FaSpinner, FaPercent} from 'react-icons/fa'
import {IOrder, IOrderItem} from '../../../app-store/types'
import {applyDiscount} from '../../../api/admin/orders.api'

interface ApplyDiscountModalProps {
  order: IOrder
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ItemDiscountRowProps {
  item: IOrderItem
  orderId: number
  onDiscountApplied: () => void
}

const ItemDiscountRow: React.FC<ItemDiscountRowProps> = ({
  item,
  orderId,
  onDiscountApplied,
}) => {
  const [discountAmount, setDiscountAmount] = useState(
    item.applied_discount_amount || 0,
  )
  const [discountPercent, setDiscountPercent] = useState(
    item.applied_discount_percent || 0,
  )
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleAmountChange = (value: string) => {
    const amount = parseInt(value || '0')
    const percent = Math.round((amount / item.original_rent) * 100)
    setDiscountAmount(amount)
    setDiscountPercent(percent)
    setApplied(false)
  }

  const handlePercentChange = (value: string) => {
    const percent = parseInt(value || '0')
    const amount = Math.round((item.original_rent * percent) / 100)
    setDiscountPercent(percent)
    setDiscountAmount(amount)
    setApplied(false)
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      await applyDiscount(orderId, item.id, {
        transaction_id: item.id,
        discount: discountAmount,
        percent: discountPercent,
      })
      setApplied(true)
      onDiscountApplied()
    } catch (error) {
      console.error('Failed to apply discount:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const finalRent = item.original_rent - discountAmount

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.product?.title}
          </p>
          <p className="text-xs text-gray-500">
            Owner: {item.product?.owner?.firstname}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Original: ₹{item.original_rent?.toLocaleString('en-IN')}
          </p>
          <p className="text-sm font-medium text-green-600">
            Final: ₹{finalRent.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Amount</label>
          <input
            type="number"
            value={discountAmount || ''}
            onChange={e => handleAmountChange(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="w-20">
          <label className="text-xs text-gray-500">%</label>
          <input
            type="number"
            value={discountPercent || ''}
            onChange={e => handlePercentChange(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || discountAmount === (item.applied_discount_amount || 0)}
            className={`px-3 py-1 text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
              applied
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {isApplying ? (
              <FaSpinner className="h-3 w-3 animate-spin" />
            ) : applied ? (
              'Applied'
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export const ApplyDiscountModal: React.FC<ApplyDiscountModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDiscountApplied = () => {
    onSuccess()
  }

  const items = order.items || []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Apply Discount - Order #{order.id}
            </h3>
            <p className="text-sm text-gray-500">
              {order.user?.firstname || order.user?.email_address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No items in this order
            </p>
          ) : (
            items.map(item => (
              <ItemDiscountRow
                key={item.id}
                item={item}
                orderId={order.id}
                onDiscountApplied={handleDiscountApplied}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total: ₹{(order.total_amount || order.amount)?.toLocaleString('en-IN')}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
