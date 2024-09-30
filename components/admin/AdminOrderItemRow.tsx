
import styles from "styles/admin-order-item.module.css";
import React, { useState } from "react";
import { RupeeSymbol } from "../RupeeSymbol";

import { IOrderItem } from "../../app-store/types";
import { ItemDiscountForm } from "./ItemDiscountForm";


export function AdminOrderItemRow({
  orderItem,
  hideImages = false,
  canApplyDiscount }:
  {
    orderItem: IOrderItem,
    hideImages?: boolean,
    canApplyDiscount?: boolean
  }) {
  const product = orderItem.product;
  const [item, setItem] = useState(orderItem);

  const handleItemChange = (item: IOrderItem) => {
    setItem(item);
  }

  return (<div className={styles.productRow} key={product.id}>
    {!hideImages && <div className={styles.productImg}>
      {
        product.photos && <img className={styles.img} src={product.photos[0]?.path}></img>
      }
    </div>}

    <div className={styles.productDesc}>
      <h3 className="font-bold text-lg">{product.title}</h3>
      <div className="pb-3">
        <div className="bg-purple-200 rounded px-2 w-fit border-purple-800">
          {item.product.owner.firstname}
        </div>
      </div>

      {product.masterProductList && product.masterProductList.map((addon: any) => (
        <div key={addon?.id} className="py-1">
          1 x {addon?.masterProduct?.name}
        </div>
      ))}



      <div className="mt-4 flex xs:flex-col justify-between gap-y-4">
        <div>
          <h3>Rent</h3>
          <div className="flex gap-x-3">
            <span className={"text-2xl  " + (item.applied_discount_amount > 0 ? "line-through text-gray-700" : " text-red-700")} >
              <RupeeSymbol />{item.original_rent}
            </span>
            {item.applied_discount_amount > 0 && <span className="text-2xl text-red-700"><RupeeSymbol />{item.rent}</span>}
          </div>

        </div>
        {canApplyDiscount && <ItemDiscountForm item={item} handleItemChange={handleItemChange} />}
      </div>


    </div>
  </div>)
}
