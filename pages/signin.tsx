import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";
import { useRouter } from "next/router";

import { FcGoogle } from "react-icons/fc";

import styles from "../styles/Signin.module.css";
import React from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

export default function Signin() {
  const router = useRouter();

  return (
    <div className="layout">
      <AppHeader navState={false} onNavStateChange={() => {}}></AppHeader>
      <Content style={{ padding: "0 50px", height: "100vh" }}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginBox}>
            <div>
              <button
                onClick={() => router.push("/auth/google")}
                className={styles.signinBtn}
              >
                <FcGoogle />
                Sign in with Google
              </button>
              <button className={styles.signinBtn}>
                <ArrowDownCircleIcon />
                Sign in with Facebook
              </button>
            </div>
          </div>
        </div>
      </Content>

      <AppFooter></AppFooter>
    </div>
  );
}
