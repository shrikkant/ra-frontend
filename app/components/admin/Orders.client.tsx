/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchOrders } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";



import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
//import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";

//import { resolveOrderStage } from "util/global.util";
import Loader from "components/Loader";

//import { IOrder } from "app-store/types";
import { fetchRevenueStats } from "api/admin/index.api";
import { RevenueSummary } from "components/admin/ReveneSummary";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import { AdminOrderHeader } from "components/admin/order/AdminOrderHeader";
import { resolveOrderStage } from "../../../util/global.util";
import { AdminOrderItemRow } from "../../../components/admin/AdminOrderItemRow";
import { useRouter } from "next/navigation";
import { IOrder } from "../../../app-store/types";
import Moment from "moment";

interface OrdersProps {
  stage: number;
}
export default function Orders({ stage }: OrdersProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>();
  const [activeKey, setActiveKey] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [revenueStats, setRevenueStats] = useState();

  const loadOrders = () => {
    setLoading(true);
    const loadStage = parseInt(String(stage));
    fetchOrders(loadStage).then((data) => {
      setLoading(false);
      setOrders(data);
    });
  };

  useEffect(() => {
    setActiveKey(parseInt(String(stage)));
    loadOrders();
    fetchRevenueStats().then((stats: any) => {
      setRevenueStats(stats);
    });
  }, [activeKey, stage]);

  const tabChanged = (key: string) => {
    router.push(`/p/admin/orders?stage=${key}`);
  };

  const canApplyDiscount = (order) => {
    return order.stage < 1;
  }

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


  return (
    <>
      <MyPageHeader title={"Orders"}></MyPageHeader>

      <div>
        {revenueStats && <RevenueSummary revenueStats={revenueStats} />}
      </div>
      {loading ? (
        <Loader />
      ) : (

        <TabGroup>
          <TabList className="flex gap-4">
            {[0, 1, 3].map((i, index) => (
              <Tab
                key={i}
                onClick={() => tabChanged(String(index))}
                className={" py-0 px-4  font-semibold focus:outline-none text-sm " + (activeKey === index ? "border-b-2 border-b-amber-500" : "")}
              >
                {resolveOrderStage(i)}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {[0, 1, 3].map((i) => (
              <TabPanel key={i} className="rounded-xl bg-white/5">
                <div>
                  {orders && orders.map((order) =>
                    <AdminOrderHeader order={order} key={order.id}>

                      <div>
                        {orderDuration(order.start_date, order.end_date)}
                      </div>
                      {order.items &&
                        order.items.map((item) => (
                          <AdminOrderItemRow
                            hideImages
                            key={item.id}
                            orderItem={item}
                            canApplyDiscount={canApplyDiscount(order)}
                          />
                        ))}
                    </AdminOrderHeader>)}
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

      )}
    </>
  );
}
