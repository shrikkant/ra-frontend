/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styles from './../styles/order-item.module.css'
import {ORDER_STEPS} from '../config/constants'

import {IOrderItem, IProduct} from '../app-store/types'

export default function OrderItemRow({
  orderItem,
  onRemove,
  orderStep,
}: {
  orderItem: IOrderItem
  onRemove?: (id: number) => void
  orderStep?: number
}) {
  const product: IProduct = orderItem.product
  const isOrderPaid = orderStep === ORDER_STEPS.ORDER_PAID

  return (
    <div
      className={'p-4 border-b-gray-50 border last:border-none '}
      key={product.id}
    >
      <div className="flex gap-x-3">
        {/* Image container - improved mobile layout */}
        <div className={'w-20 h-20 md:w-24 md:h-24 flex-shrink-0'}>
          {product && product.master_product_id && (
            <img
              className="w-full h-full object-cover rounded-lg"
              src={`/api/products/${product.master_product_id}/photo?width=240`}
              alt={product.title}
            />
          )}
        </div>

        {/* Content container */}
        <div className={'flex-1 min-w-0'}>
          <h3 className="text-base md:text-lg font-bold mb-2 text-gray-900 line-clamp-2">
            {product.title}
          </h3>

          {/* Addons */}
          {product.masterProductList &&
            product.masterProductList.map((addon: any) => {
              return (
                <div
                  key={addon?.id}
                  className="flex text-sm text-gray-600 mb-1"
                >
                  <div className="whitespace-nowrap">1 x&nbsp;</div>
                  <div className="truncate">{addon?.masterProduct?.name}</div>
                </div>
              )
            })}

          {/* Remove button - only show if not paid and onRemove function exists */}
          {!isOrderPaid && onRemove && (
            <div className="text-left pt-2">
              <button
                onClick={() => onRemove(orderItem.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
