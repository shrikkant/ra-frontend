"use client"
import {
  Input,
  Tag,
  Form
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import Moment from 'moment';
import { IUser } from "../app-store/types";
import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

interface ActivityCardProps {
  customer: IUser
}
const ActivityCard = ({ customer }: ActivityCardProps) => {

  return (<div className={styles.orderBox} key={customer.id}>

    <PageHeader
      className={styles.orderHeader}
      key={customer.id}
      ghost={false}
      tags={[<Tag key="1" color="red">{customer.verified ? <CheckBadgeIcon /> : ""}</Tag>]}
      title={"Activity Card"}
      subTitle={Moment(customer.created_ts).format('DD MMM')}></PageHeader>
    <div className="p-4">
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input placeholder="Email" value={customer.email_address} />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Phone" value={customer.phone} />
        </Form.Item>
      </Form>
    </div>
  </div>);
}

export default ActivityCard;
