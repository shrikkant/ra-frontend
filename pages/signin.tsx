import { GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";
import Layout from "antd/lib/layout";
import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";

import styles from "../styles/Signin.module.css";
import React from "react";

export default function Signin() {
  return (
    <Layout className="layout">
      <AppHeader></AppHeader>
      <Content style={{ padding: '0 50px', height: '100vh' }}>

        <div className={styles.loginWrapper}>
          <Card className={styles.loginBox}>
            <Space size={[8, 16]} wrap align="center" direction="vertical">
              <Button href="/auth/google" type="primary"
                className={styles.signinBtn} danger>
                <GoogleOutlined />Sign in with Google
              </Button>
              <Button type="primary" className={styles.signinBtn}>
                <GoogleOutlined />Sign in with Facebook
              </Button>
            </Space>
          </Card>
        </div>
      </Content>

      <AppFooter></AppFooter>
    </Layout>

  )
}

