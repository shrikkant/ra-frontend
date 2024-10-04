import { Button, Descriptions, Tag } from "antd";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";


import { getActiveOrder, setActiveOrder } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";

import Moment from "moment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";
import Loader from "components/Loader";
import { OrderStages, resolveOrderStage } from "util/global.util";
import { OrderStageForm } from "components/admin/OrderStageForm";
import { AppLayout } from "components/AppLayout";
import { OrderDeliveryForm } from "../../../../components/admin/OrderDeilveryForm";
import { IOrder } from "../../../../app-store/types";

export default function Order() {
  const router = useRouter();
  const order: IOrder = useSelector(getActiveOrder);
  const id = router.query.id;
  const [loading, setLoading] = useState(true);

  const [orderChange, setOrderChange] = useState({
    serialNoInfo: [],
    stage: 0,
    id: 0,
  });

  const dispatch = useDispatch();

  const loadOrder = () => {
    const orderId = parseInt(String(id));

    fetchOrder(orderId).then((data) => {
      dispatch(setActiveOrder(data));
      setOrderChange({ ...orderChange, id: data?.id, stage: data?.stage });
      setLoading(false);
    });
  };

  useEffect(() => {
    router.isReady && loadOrder();
  }, [order?.stage, id, router.isReady]);

  const orderDuration = (start: Date, end: Date) => {
    return (
      Moment(start).utcOffset(0).format("DD MMM hh A") +
      " - " +
      Moment(end).utcOffset(0).format("DD MMM hh A")
    );
  };


  return (
    <AppLayout>
      {order && <MyPageHeader
        title={"#" + order.id}
        subtitle={""}
        extra={[
          <Button key="stage_1" type="primary">
            {resolveOrderStage(order.stage)}
          </Button>,
        ]}
      ></MyPageHeader>}
      {loading ? (
        <Loader />
      ) : (

        <div className="p-4">
          {!order ? (
            <Loader />
          ) : (
            <div className={"border border-gray-500 flex items-start justify-start align-top"} key={order.id}>
              <div className="w-3/4">
                {order.items &&
                  order.items.map((item) => {
                    return (
                      <AdminOrderItemRow
                        key={item.id}
                        orderItem={item}
                        hideImages
                      />
                    );
                  })}
              </div>
              <div>
                {!(order.stage === OrderStages.Leads) && (
                  <OrderStageForm order={order}></OrderStageForm>
                )}

                {order.delivery_fee > 0 && <div className="p-4">
                  <OrderDeliveryForm order={order} />
                </div>}
              </div>


            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
