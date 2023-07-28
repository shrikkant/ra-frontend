
import { Button, Card, Space, Spin } from "antd";
import Layout from "antd/lib/layout";
import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";

const antIcon = <ArrowDownCircleIcon className="h-1 w-1"/>;


import styles from "../styles/Signin.module.css";
import React from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

export default function Loader() {
    return (<Content className="r-comp" style={{height:'100vh'}}>

    <div style={{display:'flex', flexDirection:'column', height: '100%'}}>
        <div className={styles.loginBox}>
        <Spin indicator={antIcon} />
        </div>
    </div>
</Content>)
}
