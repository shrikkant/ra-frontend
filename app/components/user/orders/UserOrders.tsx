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
import { Section } from "../../common/Section";

export const UserOrders: React.FC = () => {

  const loggedUser = useSelector(selectAuthState);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (loggedUser) {
      fetchOrders().then((data: IOrder[]) => {
        setOrders(data);
      });
    }
  }, [loggedUser]);
  return (<>


    <div style={{ padding: "16px 16px" }} className="right-panel">
      {!orders ?
        <Loader /> :
        <div >
          {orders.map((order: IOrder) =>

            <Section title={"Order ID: " + order.id} key={order.id}
              tags={[

              ]}>
              {order.items &&
                order.items.map((item) =>
                  <OrderItemRow
                    key={item.id}
                    orderItem={item}
                  />
                )}
            </Section>
          )}
        </div>}
    </div>

  </>);
}
