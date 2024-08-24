"use client"
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
      <div className="h-[calc(100vh-185px)] sm:h-[calc(100vh-135px)] flex w-full justify-center">
        <div className=" flex flex-col justify-center w-full items-center p-4">
          <div className="rounded p-5 md:w-80 bg-slate-100 shadow-md w-full">
            <div className="flex gap-y-5 flex-col">
              <div className="border-b pb-2">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="flex items-center justify-center">
                <GoogleSignInButton onClick={() => (window.location.href = "/auth/google")} />
              </div>
              <div className="pt-5">
                <span>We dont Spam!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
