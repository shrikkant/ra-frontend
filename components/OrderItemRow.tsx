import styles from "./../styles/order-item.module.css";
import React from "react";

import { IOrderItem, IProduct } from "../app-store/types";

export default function OrderItemRow({
  orderItem,
  onRemove,
}: {
  orderItem: IOrderItem,
  onRemove?: (id: number) => void
}) {
  const product: IProduct = orderItem.product;

  return (
    <div className={styles.productRow} key={product.id}>
      <div className={styles.productImg}>
        {(product && product.photos) && <img className={styles.img} src={product?.photos[0]?.path}></img>}
      </div>
      <div className={styles.productDesc}>
        <h3 className="text-lg font-bold mb-3">{product.title}</h3>
        {product.masterProductList && product.masterProductList.map((addon: any) => {
          return (
            <div key={addon?.id}>
              1 x {addon?.masterProduct?.name}
            </div>
          )
        })}
      </div>
      <div>
        {onRemove && <button onClick={() => onRemove(orderItem.id)} className="text-red-500">Remove</button>}
      </div>

    </div>
  );
}
