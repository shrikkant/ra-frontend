
import styles from "styles/admin-order-item.module.css";
import React, { useState } from "react";
import { RupeeSymbol } from "../RupeeSymbol";

import { IOrderItem } from "../../app-store/types";
import { ItemDiscountForm } from "./ItemDiscountForm";


export function AdminOrderItemRow({ orderItem, hideImages = false }: { orderItem: IOrderItem, hideImages?: boolean }) {
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



      <div style={{ display: "flex", columnGap: 32, alignItems: "center", justifyContent: "space-between" }} className="mt-4">
        <div>
          <h3>Rent</h3>
          <div >
            <span className="text-2xl text-red-700"><RupeeSymbol />{item.rent}</span>
          </div>
        </div>
        <ItemDiscountForm item={item} handleItemChange={handleItemChange} />
      </div>


    </div>
  </div>)
}
