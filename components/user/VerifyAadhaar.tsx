"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authUser, selectAuthState } from "../../app-store/auth/auth.slice";
import { updateAadhaar, verifyAadhaarOTP } from "../../api/user/index.api";
import { IUser } from "../../app-store/types";
import { useRouter } from "next/navigation";
import Input from "../common/form/Input";
import Button from "../common/form/Button";
import { FaCheckCircle } from "react-icons/fa";
import { STATUS_AADHAAR_VERIFIED } from "../../config/constants";

export default function VerifyAadhar() {
  const router = useRouter();
  const [aadharNumber, setAadharNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useSelector(selectAuthState);

  const dispatch = useDispatch();

  const handleInputChange = (value: string) => {
    setAadharNumber(value);
  }

  const handleOTPChange = (value: string) => {
    setOtp(value);
  }

  const validateInputAadhar = (event) => {
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
    if (!isValidAadhar(aadharNumber)) {
      return;
    }
    setIsLoading(true);
    try {
      const updateUser: IUser = await updateAadhaar(aadharNumber);
      if (updateUser.aadhaar_callback_id) {
        setOtpSent(true);
      }
    } catch (error) {
      console.error('Failed to submit Aadhaar:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const updateUser: IUser = await verifyAadhaarOTP(otp);
      dispatch(authUser(updateUser));
      router.push("/");
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (user?.verified === STATUS_AADHAAR_VERIFIED) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Aadhaar</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
            <FaCheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Aadhaar</h3>
        {otpSent && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )}
      </div>

      <div className="space-y-4">
        {!otpSent ? (
          <>
            <Input
              label="Aadhaar Number"
              pattern="[0-9]*"
              inputMode="numeric"
              onKeyDown={validateInputAadhar}
              onChange={handleInputChange}
              value={aadharNumber}
              size="lg"
            />
            <Button
              variant="primary"
              label="Send OTP"
              onClick={submitAadhar}
              isLoading={isLoading}
              disabled={!isValidAadhar(aadharNumber)}
            />
          </>
        ) : (
          <>
            <Input
              label="OTP"
              pattern="[0-9]*"
              inputMode="numeric"
              onKeyDown={validateInputAadhar}
              onChange={handleOTPChange}
              value={otp}
              size="lg"
            />
            <Button
              variant="primary"
              label="Verify OTP"
              onClick={verifyOTP}
              isLoading={isLoading}
              disabled={otp.length !== 6}
            />
          </>
        )}
      </div>
    </div>
  );
}
