import React from 'react'
import styles from './../styles/order-summary.module.css'
import {ORDER_STEPS} from '../config/constants'
import {dateDisplay} from '../util/date.util'
import {IOrder} from '../app-store/types'
import Button from './common/form/Button'
import Decimal from 'decimal.js'
import {IoCalendarOutline} from 'react-icons/io5'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../app-store/auth/auth.slice'

export default function OrderSummary({
  order,
  step,
  isLoading,
  onCallToAction,
}: {
  order: IOrder
  step: number
  showCallToAction?: boolean
  isLoading?: boolean
  onCallToAction: (mode: number) => void
}) {
  const loggedUser = useSelector(selectAuthState)
  const discount = new Decimal(
    order.applied_discount ? order.applied_discount : 0,
  )
  const totalRent = new Decimal(order.amount || 0).add(discount)
  const deliveryFee = new Decimal(order.delivery_fee || 0)
  const totalAmount = totalRent.add(deliveryFee).sub(discount)
  const callToAction = (step: number) => {
    switch (step) {
      case ORDER_STEPS.ORDER_STEP_CART:
        return loggedUser ? 'Proceed to Book' : 'Sign in to Book'
      case ORDER_STEPS.ORDER_STEP_DELIVERY:
        return 'Review & Pay'
      case ORDER_STEPS.ORDER_STEP_PAYMENT:
        return 'Place Your Order'
      case ORDER_STEPS.ORDER_PAID:
        return 'Order Placed'
    }
  }

  return (
    <div
      className={
        'p-4 bg-white border border-amber-400 shadow-lg rounded-md min-w-[276px]'
      }
    >
      <div>
        <div className="text-center text-2xl font-bold border-b border-gray-200 pb-2">
          Order Summary
        </div>
      </div>
      {/* Delivery Timeline - Early Delivery Highlight */}
      {order.start_date && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-4 mt-5">
          <div className="flex items-start gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-green-800">
                You get it a day early!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Delivery on{' '}
                {dateDisplay(
                  new Date(
                    new Date(order.start_date).getTime() - 24 * 60 * 60 * 1000,
                  ),
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rental Period */}
      <div className="border-2 border-[#FDC002] rounded-lg p-4 bg-white hover:bg-[#FDC002]/5 transition-all duration-300 mt-4">
        <div className="flex items-center gap-3">
          <IoCalendarOutline className="w-5 h-5 text-[#FDC002] flex-shrink-0" />
          <div className="flex items-center gap-6 w-full">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium mb-1 text-gray-500">
                Rental Start
              </span>
              <span className="text-base font-semibold truncate text-gray-900">
                {dateDisplay(order.start_date)}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium mb-1 text-gray-500">
                Rental End
              </span>
              <span className="text-base font-semibold truncate text-gray-900">
                {dateDisplay(order.end_date)}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center ml-auto">
              <span className="text-md font-semibold whitespace-nowrap text-[#FDC002]">
                {order.days} {order.days === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={'flex flex-col pt-3 gap-y-3 border-t border-gray-300 mt-5'}
      >
        {/* Price Breakdown with Discount Highlight */}
        {order.applied_discount && order.applied_discount > 0 ? (
          <>
            {/* Show discount percentage badge and original price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">
                  Rent for {order.days} {order.days === 1 ? 'day' : 'days'}
                </span>
                <span className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-md shadow-sm px-2 py-1">
                  {Math.round(
                    (discount.toNumber() / totalRent.toNumber()) * 100,
                  )}
                  % OFF
                </span>
              </div>
              <span className="text-sm text-gray-400 line-through">
                ₹{totalRent.toFixed(2)}
              </span>
            </div>

            {/* Discounted price */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Discounted rent</span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{new Decimal(order.amount || 0).toFixed(2)}
              </span>
            </div>

            {order.delivery_fee > 0 && (
              <div className="flex items-center justify-between text-gray-700">
                <span>Delivery &amp; Pickup Fee</span>
                <span>₹{new Decimal(order.delivery_fee || 0).toFixed(2)}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex font-bold justify-between text-xl border-t-2 border-gray-300 pt-3">
              <div className="text-gray-900">Order Total</div>
              <div className="text-rose-600">₹{totalAmount.toFixed(2)}</div>
            </div>
          </>
        ) : (
          <>
            {/* No discount - simple view */}
            <div className={styles['detail-row']}>
              <div>
                Rent for <span>{order.days}</span> days
              </div>
              <div>₹{totalRent.toFixed(2)}</div>
            </div>

            {order.delivery_fee > 0 && (
              <div className={styles['detail-row']}>
                <div>Delivery &amp; Pickup Fee</div>
                <div>₹{new Decimal(order.delivery_fee || 0).toFixed(2)}</div>
              </div>
            )}

            <div
              className={
                'flex text-rose-600 font-bold justify-between text-xl border-t border-gray-300 pt-3'
              }
            >
              <div>Order Total</div>
              <div>
                <span>₹</span>
                <span>{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Trust Indicators */}
      {step === ORDER_STEPS.ORDER_STEP_CART && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">No hidden charges</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Zero deposit</span>
            </div>
          </div>
        </div>
      )}

      <div>
        {step !== ORDER_STEPS.ORDER_PAID && (
          <div className="sticky md:relative bottom-0 left-0 py-4 px-0 md:p-0  w-full  md:shadow-none mt-4 z-50 border-t border-t-gray-300">
            {callToAction(step) && (
              <Button
                isLoading={isLoading}
                variant="primary"
                onClick={() => onCallToAction(step)}
                label={callToAction(step)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
