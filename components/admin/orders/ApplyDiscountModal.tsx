'use client'

import React, {useState, useMemo} from 'react'
import {FaTimes, FaSpinner} from 'react-icons/fa'
import {IOrder, IOrderItem} from '../../../app-store/types'
import {applyDiscount} from '../../../api/admin/orders.api'
import {formatCurrency} from '../../../util/global.util'

interface ApplyDiscountModalProps {
  order: IOrder
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ItemDiscount {
  itemId: number
  amount: number
  percent: number
  originalRent: number
  hasChanged: boolean
}

interface ItemDiscountRowProps {
  item: IOrderItem
  discount: ItemDiscount
  onDiscountChange: (itemId: number, amount: number, percent: number) => void
}

const ItemDiscountRow: React.FC<ItemDiscountRowProps> = ({
  item,
  discount,
  onDiscountChange,
}) => {
  const originalRent = Number(item.original_rent) || 0

  const handleAmountChange = (value: string) => {
    const amount = parseInt(value || '0')
    const percent = Math.round((amount / originalRent) * 100)
    onDiscountChange(item.id, amount, percent)
  }

  const handlePercentChange = (value: string) => {
    const percent = parseInt(value || '0')
    const amount = Math.round((originalRent * percent) / 100)
    onDiscountChange(item.id, amount, percent)
  }

  const finalRent = originalRent - (Number(discount.amount) || 0)

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
        <div className="text-right text-sm">
          <span className="text-gray-500">{formatCurrency(item.original_rent)}</span>
          {discount.amount > 0 && (
            <span className="text-green-600 ml-2">
              → {formatCurrency(finalRent)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={discount.amount || ''}
            onChange={e => handleAmountChange(e.target.value)}
            placeholder="Discount ₹"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="w-20">
          <input
            type="number"
            value={discount.percent || ''}
            onChange={e => handlePercentChange(e.target.value)}
            placeholder="%"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
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
  const items = order.items || []

  const [discounts, setDiscounts] = useState<Record<number, ItemDiscount>>(() => {
    const initial: Record<number, ItemDiscount> = {}
    items.forEach(item => {
      initial[item.id] = {
        itemId: item.id,
        amount: Number(item.applied_discount_amount) || 0,
        percent: Number(item.applied_discount_percent) || 0,
        originalRent: Number(item.original_rent) || 0,
        hasChanged: false,
      }
    })
    return initial
  })

  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDiscountChange = (itemId: number, amount: number, percent: number) => {
    setDiscounts(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        amount,
        percent,
        hasChanged: true,
      },
    }))
    setError(null)
  }

  const totals = useMemo(() => {
    let originalTotal = 0
    let discountTotal = 0

    items.forEach(item => {
      originalTotal += Number(item.original_rent) || 0
      discountTotal += Number(discounts[item.id]?.amount) || 0
    })

    return {
      original: originalTotal,
      discount: discountTotal,
      final: originalTotal - discountTotal,
    }
  }, [items, discounts])

  const hasChanges = useMemo(() => {
    return Object.values(discounts).some(d => d.hasChanged)
  }, [discounts])

  const handleApplyAll = async () => {
    const changedItems = Object.values(discounts).filter(d => d.hasChanged)

    if (changedItems.length === 0) {
      setError('No changes to apply')
      return
    }

    setIsApplying(true)
    setError(null)

    try {
      for (const discount of changedItems) {
        await applyDiscount(order.id, discount.itemId, {
          transaction_id: discount.itemId,
          discount: discount.amount,
          percent: discount.percent,
        })
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to apply discounts')
    } finally {
      setIsApplying(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isApplying) {
      onClose()
    }
  }

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
            disabled={isApplying}
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
                discount={discounts[item.id]}
                onDiscountChange={handleDiscountChange}
              />
            ))
          )}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 bg-gray-50 border-t space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Original Total:</span>
            <span className="text-gray-900">{formatCurrency(totals.original)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Discount:</span>
              <span className="text-green-600">-{formatCurrency(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-200">
            <span className="text-gray-900">Final Total:</span>
            <span className="text-gray-900">{formatCurrency(totals.final)}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isApplying}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyAll}
            disabled={isApplying || !hasChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isApplying && <FaSpinner className="h-4 w-4 animate-spin" />}
            Apply Discounts
          </button>
        </div>
      </div>
    </div>
  )
}
