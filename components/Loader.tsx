import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Space, Spin } from "antd";
import Layout from "antd/lib/layout";
import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


import styles from "../styles/Signin.module.css";
import React from "react";

export default function Loader() {
    return (<Content className="r-comp" style={{height:'100vh'}}>

    <div style={{display:'flex', flexDirection:'column', height: '100%'}}>
        <div className={styles.loginBox}>
        <Spin indicator={antIcon} />
        </div>
    </div>
</Content>)
}
