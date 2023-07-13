
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";
import AppNav from "components/AppNav";
import { AppFooter } from "components/footer";
import AppHeader from "components/header";

import { getActiveOrder, setActiveOrder } from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder, updateStage } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";

import Moment from 'moment';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminOrderItemRow } from "components/admin/AdminOrderItemRow";
import Loader from "components/Loader";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { OrderStages, displayMessage, resolveOrderStage } from "util/global.util";
import { OrderStageForm } from "../../../components/admin/OrderStageForm";

export default function Order() {
  const router = useRouter();
  const order = useSelector(getActiveOrder);
  const id = router.query.id;
  const [loading, setLoading] = useState(true);


  const [orderChange, setOrderChange] = useState({ serialNoInfo: [], stage: 0, id: 0 });

  const dispatch = useDispatch();
  const df = Moment().format('DD MMM');

  const loadOrder = () => {
    const orderId = parseInt(String(id));

    fetchOrder(orderId).then(data => {

      dispatch(setActiveOrder(data));
      setOrderChange({ ...orderChange, id: data?.id, stage: data?.stage });
      setLoading(false);
    })
  }

  useEffect(() => {

    router.isReady && loadOrder();
  }, [order?.stage, id, router.isReady])

  const orderDuration = (start: Date, end: Date) => {
    return Moment(start).utcOffset(0).format('DD MMM hh A') + " - " + Moment(end).utcOffset(0).format('DD MMM hh A');
  }
  let items: JSX.Element[] = [];

  return (<Content>
    <AppHeader></AppHeader>

    <Content className="main-content">
      <AppNav></AppNav>

      {loading ? <Loader /> : <Content className={styles.content}>

        <MyPageHeader title={"Orders"} subtitle={""} extra={[
          <Button key="stage_1" type="primary">
            {resolveOrderStage(order.stage)}
          </Button>,
        ]}></MyPageHeader>

        <Content style={{ padding: "16px 16px" }}>

          {!order ? <Loader /> : <Content className={styles.orderBox} key={order.id}>
            <MyPageHeader
              className={styles.orderHeader}
              ghost={false}
              tags={[<Tag key="1" color="red">{"₹" + order.total_amount}</Tag>,
              <Tag key="2" color="purple">{order.user.firstname}</Tag>]}
              title={"#" + order.id}
              subTitle={orderDuration(order.start_date, order.end_date)}
              extra={[
                <Button key="stage_1" type="primary" size="small">
                  {resolveOrderStage(order.stage)}
                </Button>,
              ]}></MyPageHeader>

            {!(order.stage === OrderStages.Leads) && <OrderStageForm order={order} ></OrderStageForm>}
            {order.items && order.items.map((item) => {
              return <AdminOrderItemRow key={item.id} orderItem={item} hideImages />
            })}

          </Content>}
        </Content>
      </Content>}



    </Content>


    <AppFooter></AppFooter>
  </Content>)
}

