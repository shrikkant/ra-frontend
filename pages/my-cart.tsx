import {
  Button,
  Layout,
  Space,
  Tag,
} from "antd";

import { PageHeader } from "@ant-design/pro-layout";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../components/AppNav";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";

import { getCart, setCart } from "../app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../api/user/orders.api";

import { OrderItemRow } from "../components/OrderItemRow";
import Moment from "moment";
import { IOrderItem } from "../app-store/types";
import React from "react";
import OrderSummary from "../components/OrderSummary";
import styles from "../styles/my-cart.module.css";
import { AppLayout } from "../components/AppLayout";

export default function Orders() {
  const cart = useSelector(getCart);
  const dispatch = useDispatch();
  const df = Moment().format('DD MMM');

  if (!cart) {
    fetchCart().then(data => {
      dispatch(setCart(data))
    })
  }

  return (
<AppLayout>
      <Content className={styles.mainContent}>
        {cart &&
          (<>
            <Content>
              <Space size={[10, 20]} direction="vertical">
                <PageHeader
                  ghost={false}
                  tags={<Tag color="red">{"₹" + cart.amount}</Tag>}
                  title={"#" + cart.id}
                  subTitle={Moment(cart.created_ts).format('DD MMM')}
                  extra={[
                    <Button key="1" type="primary">
                      Checkout
                    </Button>,
                  ]}
                ></PageHeader>

                {cart.items &&
                  cart.items.map((item: IOrderItem) => <OrderItemRow key={item.id} orderItem={item}></OrderItemRow>)}
              </Space>

            </Content>
            <Content className={styles.summaryNav}>
              <OrderSummary></OrderSummary>
            </Content>
          </>
          )
        }
      </Content>


</AppLayout>

  )
}

