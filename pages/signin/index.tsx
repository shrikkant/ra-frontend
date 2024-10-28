"use client"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authUser, selectAuthState } from "app-store/auth/auth.slice";
import GoogleSignInButton from "components/common/GoogleSignInBtn";
import { AppLayout } from "../../components/AppLayout";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/form/Input";
import Link from "next/link";
import { INPUT_ICON_TYPES } from "../../config/constants";
import Button from "../../components/common/form/Button";
import { generateLoginOTP, loginWithOTP, signupWithOTP, verifyLoginOTP } from "../../api/user/index.api";
import { IUser } from "../../app-store/types";



export default function Signin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectAuthState);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [otp, setOtp] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [errors, setErrors] = useState({ name: '', phone: '' });

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (loggedUser) {
      const storedRedirectUrl = localStorage.getItem("redirectUrl");
      if (storedRedirectUrl) {
        router.push(storedRedirectUrl);
      }
    }
  }, [loggedUser, router]);

  const validateLogin = () => {
    const updateErrors = { ...errors };
    let hasErrors = false;

    if (!phone || phone.length < 1) {
      updateErrors.phone = "Phone is required";
      hasErrors = true;
    }

    if (phone.length !== 10) {
      updateErrors.phone = "Invalid phone number";
      hasErrors = true;
    }

    setErrors(updateErrors);
    return !hasErrors;
  }


  const validateSignup = () => {
    const updateErrors = { ...errors };
    let hasErrors = false;
    if (!name || name.length < 1) {
      updateErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!phone || phone.length < 1) {
      updateErrors.phone = "Phone is required";
      hasErrors = true;
    }

    if (phone.length !== 10) {
      updateErrors.phone = "Invalid phone number";
      hasErrors = true;
    }

    setErrors(updateErrors);
    return !hasErrors;
  }

  const onPhoneChange = (phone: string) => {
    const updatedErrors = { ...errors };

    if (/^\d*$/.test(phone)) {
      setPhone(phone);
      updatedErrors.phone = '';
    } else {
      updatedErrors.phone = 'Invalid phone number';
    }
    setErrors(updatedErrors);
  }

  const onNameChange = (name: string) => {
    const updatedErrors = { ...errors };

    if (/^[a-zA-Z\s]*$/.test(name)) {
      setName(name);
      updatedErrors.name = '';
    } else {
      updatedErrors.name = 'Only alphabets are allowed';
    }
    setErrors(updatedErrors);
  }


  const onOTPChange = (otp: string) => {
    setOtp(otp);
  }

  const sendOneTimePassword = async () => {
    if (isSignup) {
      if (!validateSignup()) {
        return;
      }
    } else {
      if (!validateLogin()) {
        return;
      }
    }
    const response: any = await generateLoginOTP(phone, isSignup);
    if (response.success) {
      setOtpSent(true);
    }
  }

  const handleSignup = async () => {
    const loggedUser: IUser = await signupWithOTP(phone, otp);

    console.log("loggedUser : ", loggedUser);
    if (loggedUser?.id) {
      dispatch(authUser(loggedUser));
      const storedRedirectUrl = localStorage.getItem("redirectUrl");
      if (storedRedirectUrl) {
        router.push(storedRedirectUrl);
      } else {
        router.push("/");
      }
    }
  }

  const handleLogin = async () => {
    if (hasErrors()) {
      return;
    }

    if (isSignup) {
      return handleSignup();
    }
    const loggedUser: IUser = await loginWithOTP(phone, otp);
    if (loggedUser?.id) {
      dispatch(authUser(loggedUser));
      const storedRedirectUrl = localStorage.getItem("redirectUrl");
      if (storedRedirectUrl) {
        router.push(storedRedirectUrl);
      } else {
        router.push("/");
      }
    }
  }

  const onSignup = () => {
    resetFields();
    resetErrors();
    setIsSignup(true);
  }

  const onLogin = () => {
    resetFields();
    resetErrors();
    setIsSignup(false);
  }

  const hasErrors = (): boolean => {
    return errors.phone.length > 0 || errors.name.length > 0;
  }

  const resetErrors = () => {
    setErrors({ name: '', phone: '' });
  }
  const resetFields = () => {
    setPhone("");
    setName("");
    setOtp("");
  }



  return (
    <>


      {!otpSent && <Modal show={true} onClose={handleCloseModal} title={isSignup ? "Sign up" : "Login"} >
        <div className="w-full m-auto">
          <div>
            {isSignup &&

              <div>
                <Input name="name" label="Full name" onChange={onNameChange} value={name} size="lg" error={errors.name}></Input>
              </div>
            }
            <div>
              <Input name="phone" label="Phone" iconType={INPUT_ICON_TYPES.PHONE} onChange={onPhoneChange} value={phone} size="lg" error={errors.phone}></Input>
            </div>
            <div>
              <Button
                disabled={hasErrors()}
                variant="primary"
                onClick={sendOneTimePassword}
                label="Send One Time Password" />
            </div>
          </div>

          <div className="text-center mb-4  mt-5 flex justify-center items-center">
            <div className="border-b border-b-[#FDC002] w-1/2 mb-1 mr-1"></div>
            <div className="mb-2" >Or</div>
            <div className="border-b border-b-[#FDC002] w-1/2 mb-1 ml-1"></div>
          </div>
          <div>
            <GoogleSignInButton onClick={() => (window.location.href = "/auth/google")} />
          </div>
          {!isSignup &&
            <div className="py-4 mt-4 text-center">
              New to RentAcross? <span><Link href="#" className="text-[orange]" onClick={onSignup}>Create account</Link></span>
            </div>
          }

          {isSignup &&
            <div className="py-4 mt-4 text-center">
              Already have an account? <span><Link href="#" className="text-[orange]" onClick={onLogin}>Sign in</Link></span>
            </div>
          }
        </div>
      </Modal>
      }

      {
        otpSent &&
        <Modal show={true} onClose={handleCloseModal} title={"Verify OTP"} >
          <div className="m-auto">
            <div>
              <div>
                <Input name="otp" label="One Time Password" iconType={INPUT_ICON_TYPES.OTP} onChange={onOTPChange} value={otp} size="lg"></Input>
              </div>
              <div>
                <Button variant="primary" onClick={handleLogin} label="Login" />
              </div>
            </div>
          </div>
        </Modal>
      }


    </>);
}
