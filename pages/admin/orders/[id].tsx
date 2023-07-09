
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

export default function Order() {
  const router = useRouter();
  const order = useSelector(getActiveOrder);
  const id = router.query.id;
  const [loading, setLoading] = useState(true);
  const [formReady, setFormReady] = useState(true);

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


  const handleStageChange = (value: string) => {
    setOrderChange({ ...orderChange, stage: parseInt(value) });
  }

  const updateOrderStage = async (id: number) => {
    const updatedOrder = {...order};
    updatedOrder.stage = orderChange.stage;
    updateStage(id, orderChange).then(data => {
      displayMessage('success', 'Order stage updated successfully');
      dispatch(setActiveOrder(updatedOrder));
    })

  }

  const handleSerialNoInput = async (transactionId, addon, e) => {

    const value = e.target.value;
    const orderUpdate = { ...orderChange };

    const alreadyExists = orderUpdate.serialNoInfo.find((item) => (item.id == transactionId));

    const transactionInfo = orderUpdate.serialNoInfo.find((item) => (item.id == transactionId)) || {};

    if (alreadyExists) {
      let serialInfo: any = transactionInfo.serial_no_json.find((item) => (item.id == addon.id));
      if (serialInfo) {
        serialInfo.serial_no = value;
      } else {
        serialInfo = {};

        serialInfo.id = addon.id;
        serialInfo.productId = addon.masterProduct.id;
        serialInfo.name = addon.masterProduct.name;
        serialInfo.serial_no = value;
        transactionInfo.serial_no_json.push(serialInfo);
      }
    } else {
      transactionInfo.id = transactionId;
      transactionInfo.serial_no_json = [];
      const serialInfo: any = {};

      serialInfo.id = addon.id;
      serialInfo.productId = addon.masterProduct.id;
      serialInfo.name = addon.masterProduct.name;
      serialInfo.serial_no = value;
      transactionInfo.serial_no_json.push(serialInfo);

      orderUpdate.serialNoInfo.push(transactionInfo);
    }

    setOrderChange(orderUpdate);
    return;
  }

  const orderDuration = (start: Date, end: Date) => {
    return Moment(start).utcOffset(0).format('DD MMM hh A') + " - " + Moment(end).utcOffset(0).format('DD MMM hh A');
  }
  let items: JSX.Element[] = [];

  return (<Content>
    <AppHeader></AppHeader>

    <Content className="main-content">
      <AppNav></AppNav>

      {loading ? <Loader /> : <Content className={styles.content}>

        <MyPageHeader title={"Orders 11"} subtitle={""}></MyPageHeader>

        <Content style={{ padding: "16px 16px" }}>

          {!order ? <Loader /> : <Content className={styles.orderBox} key={order.id}>
            <PageHeader
              className={styles.orderHeader}
              ghost={false}
              tags={[<Tag key="1" color="red">{"₹" + order.amount}</Tag>,
              <Tag key="2" color="purple">{order.user.firstname}</Tag>]}
              title={"#" + order.id}
              subTitle={orderDuration(order.start_date, order.end_date)}
              extra={[
                <Button key="stage_1" type="primary">
                  {resolveOrderStage(order.stage)}
                </Button>,
              ]}></PageHeader>

            <Card style={{ padding: 16, maxWidth: 520, margin: "auto" }} title={"Update Stage"} bordered={false}>

              <Form.Item style={{ padding: "16px" }}>
                <Select value={String(orderChange.stage)} onChange={handleStageChange}>
                  <Select.Option value={String(0)} >{resolveOrderStage(0)}</Select.Option>
                  <Select.Option value={String(1)}>{resolveOrderStage(1)}</Select.Option>
                  <Select.Option value={String(2)}>{resolveOrderStage(2)}</Select.Option>
                  <Select.Option value={String(3)}>{resolveOrderStage(3)}</Select.Option>
                </Select>
              </Form.Item>

              {(order.stage !== OrderStages.InProgress && orderChange.stage === OrderStages.InProgress) &&

                order.items.map((transaction) => {


                  return transaction.product.masterProductList.length > 0 &&
                    <div key={transaction.id}>

                      <Descriptions.Item>
                        <div>{transaction.product.title}</div>
                      </Descriptions.Item>
                      {transaction.product.masterProductList.map((addon: any) => {
                        return addon &&
                          <Form.Item key={addon?.id}>
                            <Input
                              placeholder={addon?.masterProduct?.name}
                              prefix={<UserOutlined className="site-form-item-icon" />}
                              onKeyDownCapture={(e) => { handleSerialNoInput(transaction.id, addon, e) }}
                              suffix={
                                <Tooltip title="Serial #">
                                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                              }
                            />
                          </Form.Item>
                      })}
                    </div>
                }
                )}

              <Form.Item style={{ padding: 16, textAlign: "right" }}>
                <Button disabled={!formReady} type="primary" onClick={() => updateOrderStage(order.id)}>Update Stage</Button>
              </Form.Item>

            </Card>
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

