
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Layout,
  Select,
  Space,
  Tabs,
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
import { fetchOrder } from "api/admin/orders.api";
import MyPageHeader from "components/MyPageHeader";

import Moment from 'moment';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { AdminOrderItemRow } from "../../../components/admin/AdminOrderItemRow";
import Loader from "../../../components/Loader";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";


const resolveStage = (status: number) => {
  switch (status) {
    case 0:
      return "Leads";
    case 1:
      return "Paid";
    case 2:
      return "In Progress";
  }
}

export default function Order() {
  const router = useRouter();
  const order = useSelector(getActiveOrder);
  const id = router.query.id;
  const [loading, setLoading] = useState(true);
  const [orderChange, setOrderChange] = useState({ serialNoInfo: [], stage: 0, id: 0 });


  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

  console.log("Router Query", router.query);

  const dispatch = useDispatch();
  const df = Moment().format('DD MMM');

  const loadOrder = () => {
    const orderId = parseInt(String(id));

    fetchOrder(orderId).then(data => {
      console.log("Order >>> ", data.id);
      dispatch(setActiveOrder(data));
      setOrderChange({ ...orderChange, id: data?.id, stage: data?.stage });
      setLoading(false);
    })
  }

  useEffect(() => {
    router.isReady && loadOrder();
  }, [id, router.isReady])

  const handleStageChange = (value: string) => {
    setOrderChange({ ...orderChange, stage: parseInt(value) });
  }

  const handleSerialNoInput = (addon, value) => {
    const orderUpdate = { ...orderChange };

    var serialInfo: any = {};

    serialInfo.id = addon.id;
    serialInfo.productId = addon.masterProduct.id;
    serialInfo.name = addon.masterProduct.name;
    serialInfo.serial_no = value;

    const infoExists = orderUpdate.serialNoInfo.filter((item) => (item.id == addon.id)).length > 0;

    if (infoExists) {
      orderUpdate.serialNoInfo = orderUpdate.serialNoInfo.map((item) => {
        if (item.id == addon.id) {
          item.serial_no = value;
        }
        return item;
      })
    } else {
      orderUpdate.serialNoInfo.push(serialInfo);
    }

    console.log("Order Update > ", orderUpdate);
    setOrderChange(orderUpdate);

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

        <MyPageHeader title={"Orders"} subtitle={""}></MyPageHeader>

        <Content style={{ padding: '16px 16px' }}>

          {!order ? <Loader /> : <Content className={styles.orderBox} key={order.id}>
            <PageHeader
              className={styles.orderHeader}
              key={order.id}
              ghost={false}
              tags={[<Tag key="1" color="red">{"₹" + order.amount}</Tag>,
              <Tag key="2" color="purple">{order.user.firstname}</Tag>]}
              title={"#" + order.id}
              subTitle={orderDuration(order.start_date, order.end_date)}
              extra={[
                <Button key="1" type="primary">
                  Stage
                </Button>,
              ]}></PageHeader>

            <Card style={{ padding: 16, maxWidth: 520, margin: "auto" }} title={"Update Stage"} bordered={false}>

              <Form.Item style={{ padding: "16px;" }}>
                <Select value={String(orderChange.stage)} onChange={handleStageChange}>

                  <Select.Option value={0} >{resolveStage(0)}</Select.Option>
                  <Select.Option value={1}>{resolveStage(1)}</Select.Option>
                  <Select.Option value={2}>{resolveStage(2)}</Select.Option>
                </Select>
              </Form.Item>

              {orderChange.stage >= 0 &&

                order.items.map((transaction) => {


                  return transaction.product.masterProductList.length > 0 && <>

                    <Descriptions.Item >
                      <div style={{ padding: "20px 5px", fontWeight: "bold" }}>{transaction.product.title}</div>
                    </Descriptions.Item>
                    {transaction.product.masterProductList.map((addon: any) => {
                      return addon &&
                      <Form.Item key={addon?.masterProduct?.id}>
                        <Input
                          placeholder={addon?.masterProduct?.name}
                          prefix={<UserOutlined className="site-form-item-icon" />}
                          onKeyDownCapture={(e) => { handleSerialNoInput(addon, e.target.value) }}
                          suffix={
                            <Tooltip title="Serial #">
                              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                          }
                        />
                      </Form.Item>
                    })}

                  </>
                }
                )}

              <Form.Item style={{ padding: 16, textAlign: "right" }}>
                <Button type="primary">Update Stage</Button>
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

