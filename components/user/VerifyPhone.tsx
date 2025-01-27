
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { authUser } from "../../app-store/auth/auth.slice";

import PageContainer from "../common/PageContainer";
import { updatePhone } from "../../api/user/index.api";
import { IUser } from "../../app-store/types";
import { useRouter } from "next/navigation";


export default function VerifyPhone() {
  const router = useRouter();
  const [phone, setPhone] = React.useState("");
  const dispatch = useDispatch();

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  }

  const validatePhone = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      return;
    }
    if (!/^[0-9]*$/.test(event.key) && !((event.ctrlKey || event.metaKey) && (event.key === "v" || event.key === "a"))) {
      event.preventDefault();
    }
  }

  const submitPhone = async () => {
    const updateUser: IUser = await updatePhone(phone);
    window.analytics?.track("Phone Updated");
    if (updateUser?.verified) {
      dispatch(authUser(updateUser));
      router.push("/");
    }

  }

  return (
    <PageContainer>
      <div className="h-max bg-white max-w-96 flex flex-col justify-center align-bottom  m-auto gap-y-5 p-4 mb-4  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6">
        <div>
          <h1 className="text-4xl text-gray-800 font-semibol font-normal normal-case">Update your phone</h1>
        </div>
        <div className="w-full">
          <input
            placeholder="Phone"
            pattern="[0-9]*"
            inputMode="numeric"
            onKeyDown={validatePhone}
            onChange={handlePhoneChange}
            className={"  border-l-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
            type="text"
          />
        </div>
        <div className="flex justify-end">
          <button className="text-gray-800 btn hover:text-gray-700" onClick={submitPhone} >
            <span>
              Update
            </span>
          </button>
        </div>
      </div>

    </PageContainer>
  );
}
