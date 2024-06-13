import { Button, Layout, Space, Tabs, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import styles from "styles/orders.module.css";

import AppNav from "components/AppNav";
import { AppFooter } from "components/footer";
import AppHeader from "components/header";

import { getOrders, setOrders } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";

import { IOrder } from "app-store/types";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";

import { resolveOrderStage } from "util/global.util";
import Loader from "components/Loader";
import { AppLayout } from "../../../components/AppLayout";

export default function Orders() {
  const router = useRouter();
  const orders = useSelector(getOrders);
  const [activeKey, setActiveKey] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const { stage } = router.query;

  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  const loadOrders = () => {
    setLoading(true);
    const loadStage = parseInt(String(stage));

    fetchOrders(loadStage).then((data) => {
      setLoading(false);
      dispatch(setOrders(data));
    });
  };

  useEffect(() => {
    setActiveKey(parseInt(String(stage)));
    router.isReady && loadOrders();
  }, [activeKey, stage, router.isReady]);

  const tabChanged = (key: string) => {
    router.push(`/admin/orders?stage=${key}`);
  };

  const orderDuration = (start: Date, end: Date) => {
    return (
      Moment(start).utcOffset(0).format("DD MMM hh A") +
      " - " +
      Moment(end).utcOffset(0).format("DD MMM hh A")
    );
  };

  return (
    <AppLayout>
      <MyPageHeader title={"Orders"} subtitle={""}></MyPageHeader>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ padding: "16px 16px" }}>
          <Tabs
            defaultActiveKey="1"
            activeKey={String(activeKey)}
            type="card"
            size="small"
            onChange={tabChanged}
            items={[0, 1, 3].map((tab, i) => {
              const id = String(i);
              return {
                label: `${resolveOrderStage(tab)}`,
                key: id,
                children: (
                  <>
                    {orders &&
                      orders.map((order: any) => {
                        let items: JSX.Element[] = [];

                        return (
                          <div className={styles.orderBox} key={order.id}>
                            <PageHeader
                              className={styles.orderHeader}
                              key={order.id}
                              ghost={false}
                              tags={[
                                <Tag key="1" color="red">
                                  {"₹" + order.amount}
                                </Tag>,
                                <Tag key="2" color="purple">
                                  {order.user.firstname}
                                </Tag>,
                              ]}
                              title={"#" + order.id}
                              subTitle={orderDuration(
                                order.start_date,
                                order.end_date
                              )}
                              extra={[
                                <Button
                                  key="1"
                                  type="primary"
                                  onClick={() => {
                                    router.push("/admin/orders/" + order.id);
                                  }}
                                >
                                  Stage
                                </Button>,
                              ]}
                            ></PageHeader>

                            {order.items &&
                              order.items.map((item) => (
                                <AdminOrderItemRow
                                  hideImages
                                  key={item.id}
                                  orderItem={item}
                                />
                              ))}
                          </div>
                        );
                      })}
                  </>
                ),
              };
            })}
          />
        </div>
      )}
    </AppLayout>
  );
}
