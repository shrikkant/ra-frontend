"use client";
import styles from "styles/orders.module.css";

import { getOrders, setOrders } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";



import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";

import { resolveOrderStage } from "util/global.util";
import Loader from "components/Loader";

import { IOrder } from "app-store/types";
import { fetchRevenueStats } from "api/admin/index.api";
import { RevenueSummary } from "components/admin/ReveneSummary";
import { Tabs } from "antd";
import { AdminOrderHeader } from "components/admin/order/AdminOrderHeader";

interface OrdersProps {
  stage: number;
}
export default function Orders({ stage }: OrdersProps) {
  const router = useRouter();
  const orders = useSelector(getOrders);
  const [activeKey, setActiveKey] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [revenueStats, setRevenueStats] = useState<any>();


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
    loadOrders();

    !revenueStats && fetchRevenueStats().then((stats) => {
      setRevenueStats(stats);
    })
  }, [activeKey, stage]);

  const tabChanged = (key: string) => {
    router.push(`/p/admin/orders?stage=${key}`);
  };

  const canApplyDiscount = (order) => {
    return order.stage < 1;
  }

  return (
    <>
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

                          <AdminOrderHeader order={order} key={order.id}>

                            {order.items &&
                              order.items.map((item) => (
                                <AdminOrderItemRow
                                  hideImages
                                  key={item.id}
                                  orderItem={item}
                                  canApplyDiscount={canApplyDiscount(order)}
                                />
                              ))}
                          </AdminOrderHeader>

                        );
                      })}
                  </>
                ),
              };
            })}
          />
        </div>
      )}
    </>
  );
}
