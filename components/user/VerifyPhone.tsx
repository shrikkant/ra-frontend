
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { authUser } from "../../app-store/auth/auth.slice";

import PageContainer from "../common/PageContainer";
import { updatePhone } from "../../api/user/index.api";
import { IUser } from "../../app-store/types";

export default function VerifyPhone() {
  const [phone, setPhone] = React.useState("");
  const dispatch = useDispatch();

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  }

  const validatePhone = (event: any) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      return;
    }
    if (!/^[0-9]*$/.test(event.key)) {
      event.preventDefault();
    }
  }

  const submitPhone = async () => {
    const updateUser: IUser = await updatePhone(phone);
    if (updateUser?.verified) {
      dispatch(authUser(updateUser));
    }

  }

  return (
    <PageContainer>
      <div className="h-max max-w-96 flex flex-col justify-center align-bottom  m-auto gap-y-5 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white">Update Phone</h1>
        </div>
        <div className="w-full">
          <input
            placeholder="Phone"
            pattern="[0-9]*"
            inputMode="numeric"
            onKeyDown={validatePhone}
            onChange={handlePhoneChange}
            className={" w-full border-l-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
            type="text"
          />
        </div>
        <div className="flex justify-end">
          <button className="btn" onClick={submitPhone} >
            <span className="dark:text-white">
              Update
            </span>
          </button>
        </div>
      </div>

    </PageContainer>
  );
}
