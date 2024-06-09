import { Button, Layout, Space, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import styles from "styles/orders.module.css";
import { Content } from "antd/lib/layout/layout";
import { getOrders, setOrders } from "../app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, removeFromCart } from "../api/user/orders.api";
import MyPageHeader from "components/MyPageHeader";
import { IOrder } from "../app-store/types";
import  OrderItemRow  from "../components/OrderItemRow";
import Moment from "moment";
import React, { useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { selectAuthState } from "app-store/auth/auth.slice";

export default function Orders() {
  const loggedUser = useSelector(selectAuthState);
  const orders = useSelector(getOrders)?.filter((item, i) => i < 5);
  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  if (!orders && loggedUser) {
    fetchOrders().then((data) => {
      dispatch(setOrders(data));
    });
  }

  const handleRemoveFromCart = async(id)  => {
    const response = await removeFromCart(id);
    console.log(response, "removed-", id);
  };

  const clickTest = () => {
    console.log("test")
  }

  return (
    <AppLayout>
      <MyPageHeader title={"Past Orders"} subtitle={""} clickTest={clickTest}></MyPageHeader>

      <Content style={{ padding: "16px 16px" }} className="right-panel">
        {orders &&
          orders.map((order: IOrder) => {
            let items: JSX.Element[] = [];

            items.push(
              <PageHeader
                className={styles.orderHeader}
                key={order.id}
                ghost={false}
                tags={[
                  <Tag key="1" color="red">
                    {"₹" + order.amount}
                  </Tag>,
                  <Tag key="2" color="purple">
                    {order.status}
                  </Tag>,
                ]}
                title={"#" + order.id}
                subTitle={Moment(order.created_ts).format("DD MMM")}
                extra={[
                  <Button key="1" type="primary">
                    Track
                  </Button>,
                ]}
              ></PageHeader>
            );

            order.items &&
              order.items.map((item) => {
                items.push(
                  <OrderItemRow
                    key={item.id}
                    orderItem={item}
                  />
                );
              });
            return (
              <Content className={styles.orderBox} key={order.id}>
                {items}
              </Content>
            );
          })}
      </Content>
    </AppLayout>
  );
}
