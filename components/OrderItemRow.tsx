import { Button, Card, Descriptions, Space, Statistic } from "antd";
import styles from "./../styles/order-item.module.css";
import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { removeFromCart } from "api/user/orders.api";
import { IOrderItem } from "../app-store/types";

export default function OrderItemRow({ clickTest, orderItem }: { clickTest: any, orderItem: IOrderItem }) {
  const product = orderItem.product;

  const alertHello = () => {
    console.log("hello");
    clickTest();

  }
  const primaryBtn =
    orderItem.status == 4 ? (
      <Button type="default">Review</Button>
    ) : (
      <Button type="default">Track</Button>
    );

  return (
    <div className={styles.productRow} key={product.id}>
      {/* <div className={styles.productImg}>
        <img className={styles.img} src={product.photos[0]?.path}></img>
      </div>

      <div className={styles.productDesc}>
        <Descriptions
          title={product.title}
          bordered
          size={"small"}
          key="1"
          column={1}
        // extra={primaryBtn}
        >
          {product.masterProductList.length > 0 && (
            <Descriptions.Item>Kit Includes</Descriptions.Item>
          )}
          {product.masterProductList.map((addon) => (
            <Descriptions.Item key="1">
              1 x {addon?.masterProduct?.name}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div> */}
      <Button onClick={() => alertHello()}>
        <FaTrash className="fa-2x" />
      </Button>
    </div>
  );
}
