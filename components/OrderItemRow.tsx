import { Button, Card, Descriptions, Space, Statistic } from "antd";
import styles from "./../styles/order-item.module.css";
import React from "react";

export function OrderItemRow({ orderItem }) {
  const product = orderItem.product;

  const primaryBtn = orderItem.status == 4 ? <Button type="default">Review</Button> : <Button type="default">Track</Button>;

  return (<div className={styles.productRow} key={product.id}>
    <div className={styles.productImg}>

      <img className={styles.img} src={product.photos[0]?.path}></img>

    </div>

    <div className={styles.productDesc}>

      <Descriptions
        title={product.title}

        bordered
        size={"small"}
        key="1"
        column={1}
      //        extra={primaryBtn}
      >
        <Descriptions.Item>Kit Includes</Descriptions.Item>
        {product.masterProductList.map((addon) => (
          <Descriptions.Item key="1">1 x {addon?.masterProduct?.name}</Descriptions.Item>
        ))}
      </Descriptions>


    </div>
  </div>)
}
