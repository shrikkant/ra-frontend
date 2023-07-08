import { Button, Card, Descriptions, Space, Statistic, Tag } from "antd";
import styles from "styles/admin-order-item.module.css";
import React from "react";
import { RupeeSymbol } from "../RupeeSymbol";

export function AdminOrderItemRow({ orderItem, hideImages = false }) {
  const product = orderItem.product;

  const primaryBtn = orderItem.status == 4 ? <Button type="default">Review</Button> : <Button type="default">Track</Button>;

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

        <Descriptions.Item style={{ fontWeight: "bold" }}>{product.title}</Descriptions.Item>
        {product.masterProductList.map((addon) => (
          <Descriptions.Item key="1">1 x {addon?.masterProduct?.name}</Descriptions.Item>
        ))}

        <Descriptions.Item>
          <div style={{ display: "flex", columnGap:32}}>
            <Statistic title="Rent" value={orderItem.rent} prefix={<RupeeSymbol />} />
            <Statistic title="Delivery Fee" value={orderItem.delivery_fee} prefix={<RupeeSymbol />} />
          </div>


        </Descriptions.Item>
      </Descriptions>



      <div className={styles.ownerInfo}>
        <Tag color="purple">{orderItem.product.owner.firstname}</Tag>
      </div>

    </div>
  </div>)
}
