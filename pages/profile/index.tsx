import { AppstoreOutlined, ArrowDownOutlined, GoogleOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Layout, Menu, MenuProps, Space, Statistic, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../../components/AppNav";
import { AppFooter } from "../../components/footer";
import AppHeader from "../../components/header";

import { useDispatch, useSelector } from "react-redux";
import Moment from 'moment';

export default function MyProfile() {
  const df = Moment().format('DD MMM');

  return (
    <Layout className="layout">
      <AppHeader></AppHeader>
      <Content style={{ background: '#fff', minHeight: '100vh', display: 'flex' }}>
        <AppNav></AppNav>
        My Profile

      </Content>


      <AppFooter></AppFooter>
    </Layout>

  )
}

