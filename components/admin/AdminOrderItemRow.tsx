import { Button, Card, Descriptions, Form, Input, Radio, Space, Statistic, Switch, Tag } from "antd";
import styles from "styles/admin-order-item.module.css";
import React, { useState } from "react";
import { RupeeSymbol } from "../RupeeSymbol";

import { IOrder, IOrderItem } from "../../app-store/types";
import { useDispatch } from "react-redux";
import { ItemDiscountForm } from "./ItemDiscountForm";


export function AdminOrderItemRow({ orderItem, hideImages = false }) {
  const dispatch = useDispatch();
  const product = orderItem.product;
  const [item, setItem] = useState(orderItem);

  const handleItemChange = (item: IOrderItem) => {
    setItem(item);
  }

  return (<div className={styles.productRow} key={product.id}>
    {!hideImages && <div className={styles.productImg}>
      <img className={styles.img} src={product.photos[0]?.path}></img>
    </div>}

    <div className={styles.productDesc}>
      <Descriptions
        bordered
        size={"small"}
        key="1"
        column={1}
      >

        <Descriptions.Item style={{ fontWeight: "bold" }}><div style={{ marginRight: 16 }}>
          {product.title}
        </div>
          <Tag color="purple">{item.product.owner.firstname}</Tag></Descriptions.Item>
        {product.masterProductList.map((addon) => (
          <Descriptions.Item key="1">1 x {addon?.masterProduct?.name}</Descriptions.Item>
        ))}

        <Descriptions.Item>
          <div style={{ display: "flex", columnGap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <Statistic valueStyle={{ color: '#3f8600' }} title="Rent" value={item.rent} prefix={<RupeeSymbol />} />
            <ItemDiscountForm item={item} handleItemChange={handleItemChange} />
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  </div>)
}
