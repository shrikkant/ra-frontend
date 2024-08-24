"use client"
import { Content } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "app-store/auth/auth.slice";
import GoogleSignInButton from "components/common/GoogleSignInBtn";
import { AppLayout } from "../../components/AppLayout";

export default function Signin() {
  const router = useRouter();
  const loggedUser = useSelector(selectAuthState);

  useEffect(() => {
    if (loggedUser) {
      const storedRedirectUrl = localStorage.getItem("redirectUrl");
      if (storedRedirectUrl) {
        router.push(storedRedirectUrl);
      }
    }
  }, [loggedUser, router]);

  return (
    <AppLayout>
      <Content className="h-[calc(100vh-185px)] sm:h-[calc(100vh-135px)] flex w-full justify-center">
        <div className=" flex flex-col justify-center">
          <div className="rounded border p-5 w-[300]">
            <div className="flex gap-y-5 flex-col">
              <div className="border-b pb-2">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="flex items-center justify-center">
                <GoogleSignInButton onClick={() => (window.location.href = "/auth/google")} />
              </div>
            </div>
          </div>
        </div>
      </Content>
    </AppLayout>
  );
}
