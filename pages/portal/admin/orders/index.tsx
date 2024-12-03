import { Button, Tabs, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import styles from "styles/orders.module.css";

import { getOrders, setOrders } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";


import Moment from "moment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";

import { resolveOrderStage } from "util/global.util";
import Loader from "components/Loader";
import { AppLayout } from "components/AppLayout";
import { IOrder } from "../../../../app-store/types";
import Link from "next/link";
import { fetchRevenueStats } from "../../../../api/admin/index.api";
import { RevenueSummary } from "../../../../components/admin/ReveneSummary";

export default function Orders() {
  const router = useRouter();
  const orders = useSelector<IOrder[]>(getOrders);
  const [activeKey, setActiveKey] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [revenueStats, setRevenueStats] = useState<any>();
  const { stage } = router.query;

  const dispatch = useDispatch();

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

    !revenueStats && fetchRevenueStats().then((stats) => {
      setRevenueStats(stats);
    })
  }, [activeKey, stage, router.isReady]);

  const tabChanged = (key: string) => {
    router.push(`/portal/admin/orders?stage=${key}`);
  };

  const orderDuration = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return "";
    }

    return (
      Moment(start).utcOffset(0).format("DD MMM") +
      " - " +
      Moment(end).utcOffset(0).format("DD MMM")
    );
  };

  const canApplyDiscount = (order) => {
    return order.stage < 1;
  }

  return (
    <AppLayout>
      <MyPageHeader title={"Orders"} subtitle={""}></MyPageHeader>

      <div className="px-4">
        {revenueStats && <RevenueSummary revenueStats={revenueStats} />}
      </div>
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
                      orders.map((order: IOrder) => {

                        return (
                          <div className={styles.orderBox + " my-3"} key={order.id}>
                            <PageHeader
                              className={styles.orderHeader}
                              key={order.id}
                              ghost={false}
                              tags={[
                                <Tag key="1" color="red">
                                  {"₹" + order.amount}
                                </Tag>,
                                <Tag key="2" color="purple">
                                  <Link href={`/portal/admin/customers/${order.user.id}`}>
                                    {order.user.firstname}
                                  </Link>
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
                                    router.push("/portal/admin/orders/" + order.id);
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
                                  canApplyDiscount={canApplyDiscount(order)}
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
