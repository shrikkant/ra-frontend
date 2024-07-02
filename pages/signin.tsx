import { Content } from "antd/lib/layout/layout";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "app-store/auth/auth.slice";
import GoogleSignInButton from "../components/common/GoogleSignInBtn";

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
    <div className="layout">
      <AppHeader navState={false} onNavStateChange={() => { }}></AppHeader>
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

              <div
                onClick={() => (window.location.href = "/auth/facebook")}
                className="flex items-center justify-center"
              >
                <button
                  type="button"
                  className="py-2 px-4 max-w-md  flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base  shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="mr-2"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
                  </svg>
                  Sign in with Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </Content>

      <AppFooter></AppFooter>
    </div>
  );
}
