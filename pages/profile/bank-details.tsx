
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../../components/AppNav";
import { AppFooter } from "../../components/footer";
import AppHeader from "../../components/header";

import { useDispatch, useSelector } from "react-redux";
import Moment from 'moment';
import React from "react";

export default function BankDetails() {
  const df = Moment().format('DD MMM');

  return (
    <Layout className="layout">
      <AppHeader></AppHeader>
      <Content style={{ background: '#fff', minHeight: '100vh', display: 'flex' }}>
        <AppNav></AppNav>
        <Content>
          Bank Details
        </Content>

      </Content>


      <AppFooter></AppFooter>
    </Layout>

  )
}

