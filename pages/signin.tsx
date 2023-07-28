import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";
import { useRouter } from "next/router";

import { FcGoogle } from "react-icons/fc";

import { FaFacebookF } from "react-icons/fa";

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
            <div className="flex gap-y-5 flex-col">
              <div>
                <h1 className="text-3xl font-semibold">Login</h1>
              </div>
              <button
                onClick={() => router.push("/auth/google")}
                className={
                  "flex font-semibold items-center text-lg gap-x-2 border-gray-400 border px-4 py-2  rounded-md w-full"
                }
              >
                <FcGoogle className="h-6 w-6" />
                <span className="text-center w-full">Sign in with Google</span>
              </button>
              <button
                className={
                  "flex font-semibold items-center text-lg gap-x-2 border-gray-400 border px-4 py-2  rounded-md w-full"
                }
              >
                <FaFacebookF className="h-6 w-6" />
                <span className="text-center w-full">
                  Sign in with Facebook
                </span>
              </button>
            </div>
          </div>
        </div>
      </Content>

      <AppFooter></AppFooter>
    </div>
  );
}
