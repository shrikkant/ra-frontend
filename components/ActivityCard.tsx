"use client"
import {
  Button,
  Input,
  Layout,
  Space,
  Tag,
  Form
} from "antd";
import { useRouter } from "next/router";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";

import Moment from 'moment';
import { IUser } from "../app-store/types";
import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";


const ActivityCard = ({ customer }) => {

  return (<Content className={styles.orderBox} key={customer.id}>

    <PageHeader
      className={styles.orderHeader}
      key={customer.id}
      ghost={false}
      tags={[<Tag key="1" color="red">{customer.verified ? <CheckBadgeIcon /> : ""}</Tag>]}
      title={"Activity Card"}
      subTitle={Moment(customer.created_ts).format('DD MMM')}></PageHeader>
    <Content style={{ padding: 16 }}>
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input placeholder="Email" value={customer.email_address} />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Phone" value={customer.phone} />
        </Form.Item>
      </Form>
    </Content>
  </Content>);
}

export default ActivityCard;
