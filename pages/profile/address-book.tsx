import { Card, Layout, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../../components/AppNav";
import { AppFooter } from "../../components/footer";
import AppHeader from "../../components/header";
// import styles from "./../../styles/";
import styles from "./../../styles/address-book.module.css"

import { useSelector } from "react-redux";
import Moment from 'moment';
import { selectAuthState } from "../../app-store/auth/auth.slice";

import MyPageHeader from "../../components/MyPageHeader";
import React from "react";

export default function AddressBook() {
  const df = Moment().format('DD MMM');
  const loggedUser = useSelector(selectAuthState);


  return (
    <Layout className="layout">
      <AppHeader></AppHeader>
      <Content style={{ background: '#fff', minHeight: '100vh', display: 'flex' }}>
        <AppNav></AppNav>

        <Content >
          <MyPageHeader title={"Address Book"} subtitle={"Manage your adddresses"}></MyPageHeader>
          <Content style={{ padding: '16px 24px' }}>
            <Space size={[24, 24]} className={styles.grid}>
              {loggedUser?.address?.map((address: any) => (
                <Card
                  title={address.address_line_2 + ' ' + address.city}
                  key={address.id}
                  hoverable
                  style={{ width: 320 }}
                >

                </Card>
              ))}
            </Space>
          </Content>

        </Content>

      </Content>


      <AppFooter></AppFooter>
    </Layout>

  )
}

