import React from 'react'
import styles from '../../styles/order-summary.module.css'

const toFixed2 = (n: number) => Number(n).toFixed(2)

export function PriceBreakdown({
  days,
  totalRent,
  discountedRent,
  discount,
  discountPercent,
  deliveryFee,
  totalAmount,
}: {
  days: number
  totalRent: number
  discountedRent: number
  discount: number
  discountPercent: number
  deliveryFee: number
  totalAmount: number
}) {
  const dayLabel = days === 1 ? 'day' : 'days'

  if (discount > 0) {
    return (
      <div className="flex flex-col pt-3 gap-y-3 border-t border-gray-300 mt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">
              Rent for {days} {dayLabel}
            </span>
            <span className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-md shadow-sm px-2 py-1">
              {discountPercent}% OFF
            </span>
          </div>
          <span className="text-sm text-gray-400 line-through">
            ₹{toFixed2(totalRent)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Discounted rent</span>
          <span className="text-lg font-semibold text-gray-900">
            ₹{toFixed2(discountedRent)}
          </span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex items-center justify-between text-gray-700">
            <span>Delivery &amp; Pickup Fee</span>
            <span>₹{toFixed2(deliveryFee)}</span>
          </div>
        )}

        <div className="flex font-bold justify-between text-xl border-t-2 border-gray-300 pt-3">
          <div className="text-gray-900">Order Total</div>
          <div className="text-rose-600">₹{toFixed2(totalAmount)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-3 gap-y-3 border-t border-gray-300 mt-5">
      <div className={styles['detail-row']}>
        <div>
          Rent for <span>{days}</span> {dayLabel}
        </div>
        <div>₹{toFixed2(totalRent)}</div>
      </div>

      {deliveryFee > 0 && (
        <div className={styles['detail-row']}>
          <div>Delivery &amp; Pickup Fee</div>
          <div>₹{toFixed2(deliveryFee)}</div>
        </div>
      )}

      <div className="flex text-rose-600 font-bold justify-between text-xl border-t border-gray-300 pt-3">
        <div>Order Total</div>
        <div>
          <span>₹</span>
          <span>{toFixed2(totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}
