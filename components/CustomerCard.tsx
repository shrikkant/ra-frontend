"use client"
import {
  Input,
  Tag,
  Form
} from "antd";

import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";

import Moment from 'moment';

import React from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { IUser } from "../app-store/types";
import { FaCheckCircle, FaSignInAlt, FaWhatsappSquare } from "react-icons/fa";
import Link from "next/link";
import { authUser, logout, setAdminLogin } from "../app-store/auth/auth.slice";
import { getAdminAuthUser } from "../api/auth.api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";


export default function CustomerCard({ customer }: { customer: IUser }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const adminLogin = (customerId: number) => {
    dispatch(logout());
    getAdminAuthUser(customerId).then((loggedUser) => {
      dispatch(authUser(loggedUser));
      dispatch(setAdminLogin(true));
      router.push("/");
    });
  }

  return (<Content className={styles.orderBox} key={customer.id}>

    <PageHeader
      className={styles.orderHeader}
      key={customer.id}
      ghost={false}
      tags={[<Tag key="1" color="red">{customer.verified ? <ArrowDownCircleIcon /> : ""}</Tag>]}
      title={customer.firstname + " " + customer?.lastname}
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
      <div className=" flex justify-center items-center gap-x-2">
        {customer?.verified === 3 &&
          <div>
            <FaCheckCircle className="text-green-600" size={"28"} />
          </div>}

        {customer?.phone &&
          <Link
            target="_blank"
            href={`https://wa.me/91${customer.phone}?text=Hi ${customer.firstname}, Thank you for joining RentAcross. What are you looking to rent today?`}>
            <FaWhatsappSquare size={"28"} />
          </Link>}

        <button onClick={() => adminLogin(customer.id)} className="p-2">
          <FaSignInAlt size={"28"} />
        </button>
      </div>
    </Content>
  </Content>);
}


