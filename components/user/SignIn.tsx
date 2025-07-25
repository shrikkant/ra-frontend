/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from 'app-store/auth/auth.slice'
import GoogleSignInButton from 'components/common/GoogleSignInBtn'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/form/Input'
import Link from 'next/link'
import {INPUT_ICON_TYPES} from '../../config/constants'
import Button from '../../components/common/form/Button'
import {generateLoginOTP, loginWithOTP} from '../../api/user/index.api'
import {IUser} from '../../app-store/types'
import CountdownTimer from '../CountDownTimer'
import OTPInput from './OTPInput'
import {GA_EVENTS, trackGAEvent} from '../../utils/analytics'

export default function SignIn({onClose}: {onClose: () => void}) {
  const dispatch = useDispatch()
  const loggedUser = useSelector(selectAuthState)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState<string>('')

  const [otpSent, setOtpSent] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(0)

  const [errors, setErrors] = useState({phone: ''})

  const [showModal, setShowModal] = useState(true)

  const handleCloseModal = () => {
    setShowModal(false)
    onClose()
  }

  useEffect(() => {}, [loggedUser])

  const validateLogin = () => {
    const updateErrors = {...errors}
    let hasErrors = false

    if (!phone || phone.length < 1) {
      updateErrors.phone = 'Phone is required'
      hasErrors = true
    }

    if (phone.length !== 10) {
      updateErrors.phone = 'Invalid phone number'
      hasErrors = true
    }

    setErrors(updateErrors)
    return !hasErrors
  }

  const onPhoneChange = (phone: string) => {
    const updatedErrors = {...errors}

    if (/^\d*$/.test(phone)) {
      // Limit to 10 digits only
      const limitedPhone = phone.slice(0, 10)
      setPhone(limitedPhone)
      updatedErrors.phone = ''
    } else {
      updatedErrors.phone = 'Invalid phone number'
    }
    setErrors(updatedErrors)
  }

  const onOTPChange = (otp: string) => {
    setOtp(otp)
  }

  const sendOneTimePassword = async () => {
    if (!validateLogin()) {
      return
    }
    const response: any = await generateLoginOTP(phone, false)
    if (response.success) {
      setOtpSent(true)
      setOtpExpiry(response.expiryTimeInSeconds)
    }
  }

  const handleLogin = async () => {
    if (hasErrors()) {
      return
    }

    const loggedUser: IUser = await loginWithOTP(phone, otp)
    if (loggedUser?.id) {
      dispatch(authUser(loggedUser))
      onClose()
    }
  }

  const hasErrors = (): boolean => {
    return errors.phone.length > 0
  }

  const isPhoneValid = (): boolean => {
    return phone.length === 10 && errors.phone.length === 0
  }

  const resetErrors = () => {
    setErrors({phone: ''})
  }

  const resetFields = () => {
    setPhone('')
    setOtp('')
  }

  const onOtpTimeout = () => {
    setOtpExpiry(0)
  }

  return (
    <>
      {!otpSent && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={'Signup/Login'}
          logoTitle={true}
        >
          <div className=" m-auto">
            {/* <h1 className="text-center text-xl font-semibold py-4">
              Signup / Login
            </h1> */}

            <div>
              <div className="text-lg font-normal  ml-1">
                <span className="font-semibold">Login</span> or{' '}
                <span className="font-semibold">Signup</span>
              </div>
              <div>
                <Input
                  name="phone"
                  label="Phone"
                  iconType={INPUT_ICON_TYPES.PHONE}
                  onChange={onPhoneChange}
                  value={phone}
                  size="lg"
                  error={errors.phone}
                ></Input>
              </div>
              <div className="mt-5 w-1/2 m-auto">
                <Button
                  disabled={!isPhoneValid()}
                  variant="primary"
                  onClick={sendOneTimePassword}
                  label="Send OTP"
                />
              </div>
              <div
                className="text-center text-lg font-normal mt-4"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                }}
              >
                Quick, reliable, and trusted
              </div>
            </div>
          </div>
        </Modal>
      )}

      {otpSent && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={'OTP Verification'}
          logoTitle={true}
        >
          <div className="m-auto">
            <div>
              <div className="text-md font-light py-4 text-center text-gray-600">
                Check text messages for your OTP
              </div>
              <div className="flex gap-x-2">
                <OTPInput onChange={otp => onOTPChange(otp)} />
              </div>
              <div>
                <Button variant="primary" onClick={handleLogin} label="Login" />
              </div>
            </div>
            {otpExpiry > 0 && (
              <CountdownTimer seconds={otpExpiry} onTimeUp={onOtpTimeout} />
            )}
            {otpExpiry === 0 && (
              <div className="text-gray-600 text-center font-light py-4">
                Not received OTP?{' '}
                <span
                  onClick={sendOneTimePassword}
                  className="font-normal cursor-pointer text-[#E5C71F]"
                >
                  Resend Now
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
