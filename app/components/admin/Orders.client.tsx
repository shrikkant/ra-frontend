/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getOrders, setOrders } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
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

interface OrdersProps {
  stage: number;
}
export default function Orders({ stage }: OrdersProps) {
  const router = useRouter();
  const orders = useSelector(getOrders);
  const [activeKey, setActiveKey] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [revenueStats, setRevenueStats] = useState();

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

  return (
    <>
      <MyPageHeader title={"Orders !!"}></MyPageHeader>

      <div className="px-4">
        {revenueStats && <RevenueSummary revenueStats={revenueStats} />}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ padding: "16px 16px" }}>
          <TabGroup>
            <TabList className="flex gap-4">
              {[0, 1, 3].map((i) => (
                <Tab
                  key={i}
                  onClick={() => tabChanged(String(i))}
                  className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {resolveOrderStage(i)}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {[0, 1, 3].map((i) => (
                <TabPanel key={i} className="rounded-xl bg-white/5 p-3">
                  <div>
                    {orders && orders.map((order) => <AdminOrderHeader order={order} key={order.id}>

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
        </div>
      )}
    </>
  );
}
