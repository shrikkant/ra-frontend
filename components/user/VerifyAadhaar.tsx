
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { authUser } from "../../app-store/auth/auth.slice";

import { updateAadhaar, verifyAadhaarOTP } from "../../api/user/index.api";
import { IUser } from "../../app-store/types";
import { useRouter } from "next/navigation";


export default function VerifyAadhar() {
  const router = useRouter();
  const [aadharNumber, setAadharNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (e: any) => {
    setAadharNumber(e.target.value);
  }

  const handleOTPChange = (e: any) => {
    setOtp(e.target.value);
  }

  const validateInputAadhar = (event: any) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      return;
    }
    if (!/^[0-9]*$/.test(event.key)) {
      event.preventDefault();
    }
  }

  const isValidAadhar = (aadhar: string) => {
    if (aadhar.length !== 12) {
      return false;
    }
    return true;
  }

  const submitAadhar = async () => {
    if (!isValidAadhar(aadharNumber))
      return
    const updateUser: IUser = await updateAadhaar(aadharNumber);
    console.log(updateUser);
    if (updateUser.aadhaar_callback_id) {
      setOtpSent(true);
    }
  }

  const verifyOTP = async () => {
    const updateUser: IUser = await verifyAadhaarOTP(otp);
    dispatch(authUser(updateUser));
    router.push("/");
  }



  return (
    <div className="p-4 rounded-md xs:w-full">
      <div className="w-full   flex  rounded-sm justify-center">
        <div className="h-max bg-slate-300  sm:w-[320px] xs:mx-4 flex flex-col justify-center align-bottom  m-auto gap-y-5 p-4 mb-4 rounded-lg shadow-sm 2xl:col-span-2 sm:p-4">
          <div className="text-gray-100">
            <h2 className="text-4xl text-gray-700  font-semibol font-normal normal-case">Verify Aadhaar</h2>
          </div>

          {!otpSent &&
            <div className="flex flex-col gap-y-4">
              <div className="w-full">
                <input
                  placeholder="Aadhaar Number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onKeyDown={validateInputAadhar}
                  onChange={handleInputChange}
                  className={"  border-l-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                  type="text"
                />
              </div>
              <div className="flex justify-end">
                <button className="text-gray-700 hover:text-gray-700 btn" onClick={submitAadhar} >
                  <span>
                    Send OTP
                  </span>
                </button>
              </div>
            </div>}

          {otpSent && <>
            <div className="w-full">
              <input
                placeholder="OTP"
                pattern="[0-9]*"
                inputMode="numeric"
                onKeyDown={validateInputAadhar}
                onChange={handleOTPChange}
                className={"  border-l-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                type="text"
              />
            </div>
            <div className="flex justify-end">
              <button className="text-gray-700 btn hover:text-gray-500 " onClick={verifyOTP} >
                <span>
                  Submit OTP
                </span>
              </button>
            </div>

          </>}

        </div>
      </div>
    </div>
  );
}
