"use client";
import { Button, Input, Layout, Space, Tag, Form } from "antd";
import { useRouter } from "next/router";
import { PageHeader } from "@ant-design/pro-layout";

import styles from "styles/orders.module.css";

import { Content } from "antd/lib/layout/layout";
import AppNav from "../../../components/AppNav";
import { AppFooter } from "../../../components/footer";
import AppHeader from "../../../components/header";
import ActivityCard from "../../../components/ActivityCard";
import DocumentsCard from "../../../components/DocumentsCard";

import { useDispatch, useSelector } from "react-redux";
import MyPageHeader from "../../../components/MyPageHeader";

import Moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getActiveCustomer,
  setActiveCustomer,
} from "../../../app-store/admin/index.slice";

import { fetchActiveCustomer } from "../../../api/admin/customers.api";
import CustomerCard from "../../../components/CustomerCard";
import { AppLayout } from "../../../components/AppLayout";

export default function Customers() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);

  const customerId = parseInt(String(id));
  const activeCustomer = useSelector(getActiveCustomer);
  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  const loadActiveCustomer = () => {
    setLoading(true);

    fetchActiveCustomer(customerId).then((customer) => {
      setLoading(false);
      dispatch(setActiveCustomer(customer));
    });
  };

  useEffect(() => {
    router.isReady && loadActiveCustomer();
  }, [router.isReady]);

  return (
    <AppLayout>
      <MyPageHeader title={"Customers"} subtitle={""}></MyPageHeader>

      {activeCustomer && (
        <Content>
          <Content
            style={{ display: "flex", padding: "16px 16px", columnGap: 16 }}
          >
            <Content style={{ flex: 1 }}>
              <CustomerCard customer={activeCustomer}></CustomerCard>
            </Content>
            <Content style={{ flex: 1 }}>
              <ActivityCard customer={activeCustomer}></ActivityCard>
            </Content>
          </Content>
          <Content style={{ padding: 16, display: "flex" }}>
            <Content style={{ flex: 1 }}>
              <DocumentsCard customer={activeCustomer}></DocumentsCard>
            </Content>
          </Content>
        </Content>
      )}
    </AppLayout>
  );
}
