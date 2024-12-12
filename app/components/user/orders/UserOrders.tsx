"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../../app-store/auth/auth.slice";
import { IOrder } from "../../../../app-store/types";
import { fetchOrders } from "../../../../api/user/orders.api";
import OrderItemRow from "../../../../components/OrderItemRow";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Tag } from "antd";
import styles from "styles/orders.module.css";
import Moment from "moment";
import Loader from "../../../../components/Loader";

export const UserOrders: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const loggedUser = useSelector(selectAuthState);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (loggedUser) {
      fetchOrders().then((data: IOrder[]) => {
        setOrders(data);
      });
    }
  }, [loggedUser]);

  return (<>

    {isClient &&
      <div style={{ padding: "16px 16px" }} className="right-panel">
        {!orders ?
          <Loader /> :
          orders.map((order: IOrder) => {
            const items: JSX.Element[] = [];

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
              >

              </PageHeader>
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
              <div key={order.id}>
                {items}
              </div>
            );
          })}
      </div>
    }
  </>);
}
