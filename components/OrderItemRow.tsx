/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styles from './../styles/order-item.module.css'

import {IOrderItem, IProduct} from '../app-store/types'

export default function OrderItemRow({
  orderItem,
  onRemove,
}: {
  orderItem: IOrderItem
  onRemove?: (id: number) => void
}) {
  const product: IProduct = orderItem.product

  return (
    <div
      className={'p-4 border-b-gray-50 border last:border-none '}
      key={product.id}
    >
      <div className="flex gap-x-2">
        <div className={'w-1/4 flex justify-center align-top'}>
          {product && product.master_product_id && (
            <img
              className={styles.img}
              src={`/api/products/${product.master_product_id}/photo?width=240`}
            ></img>
          )}
        </div>
        <div className={'w-3/4'}>
          <h3 className="text-lg font-bold mb-3">{product.title}</h3>
          {product.masterProductList &&
            product.masterProductList.map((addon: any) => {
              return (
                <div key={addon?.id} className="flex">
                  <div className="whitespace-nowrap">1 x&nbsp;</div>
                  <div>{addon?.masterProduct?.name}</div>
                </div>
              )
            })}

          <div className="text-left pt-3">
            {onRemove && (
              <button
                onClick={() => onRemove(orderItem.id)}
                className="text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
