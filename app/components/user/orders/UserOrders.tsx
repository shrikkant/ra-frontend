"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../../app-store/auth/auth.slice";
import { IOrder } from "../../../../app-store/types";
import { fetchOrders } from "../../../../api/user/orders.api";
import OrderItemRow from "../../../../components/OrderItemRow";
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


    <div>
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
