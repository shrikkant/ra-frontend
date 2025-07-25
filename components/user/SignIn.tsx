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
import {
  generateLoginOTP,
  loginWithOTP,
  signupWithOTP,
} from '../../api/user/index.api'
import {IUser} from '../../app-store/types'
import CountdownTimer from '../CountDownTimer'
import OTPInput from './OTPInput'
import {GA_EVENTS, trackGAEvent} from '../../utils/analytics'

export default function SignIn({onClose}: {onClose: () => void}) {
  const dispatch = useDispatch()
  const loggedUser = useSelector(selectAuthState)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState<string>('')
  const [isSignup, setIsSignup] = useState(true)

  const [otpSent, setOtpSent] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(0)

  const [errors, setErrors] = useState({name: '', phone: ''})

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

  const validateSignup = () => {
    const updateErrors = {...errors}
    let hasErrors = false
    // if (!name || name.length < 1) {
    //   updateErrors.name = 'Name is required'
    //   hasErrors = true
    // }

    // if (name && name.split(' ').length < 2) {
    //   updateErrors.name = 'Please enter full name'
    //   hasErrors = true
    // }

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
      setPhone(phone)
      updatedErrors.phone = ''
    } else {
      updatedErrors.phone = 'Invalid phone number'
    }
    setErrors(updatedErrors)
  }

  const onNameChange = (name: string) => {
    const updatedErrors = {...errors}

    if (/^[a-zA-Z\s]*$/.test(name)) {
      setName(name)
      updatedErrors.name = ''
    } else {
      updatedErrors.name = 'Only alphabets are allowed'
    }
    setErrors(updatedErrors)
  }

  const onOTPChange = (otp: string) => {
    setOtp(otp)
  }

  const sendOneTimePassword = async () => {
    if (isSignup) {
      if (!validateSignup()) {
        return
      }
    } else {
      if (!validateLogin()) {
        return
      }
    }
    const response: any = await generateLoginOTP(phone, isSignup)
    if (response.success) {
      setOtpSent(true)
      setOtpExpiry(response.expiryTimeInSeconds)
    }
  }

  const handleSignup = async () => {
    const loggedUser: IUser = await signupWithOTP(phone, otp, name)
    if (loggedUser?.id) {
      trackGAEvent(GA_EVENTS.SIGNUP, {
        method: 'phone',
      })
      dispatch(authUser(loggedUser))
      onClose()
    }
  }

  const handleLogin = async () => {
    if (hasErrors()) {
      return
    }

    if (isSignup) {
      return handleSignup()
    }
    const loggedUser: IUser = await loginWithOTP(phone, otp)
    if (loggedUser?.id) {
      dispatch(authUser(loggedUser))
      onClose()
    }
  }

  const onSignup = () => {
    resetFields()
    resetErrors()
    setIsSignup(true)
  }

  const onLogin = () => {
    resetFields()
    resetErrors()
    setIsSignup(false)
  }

  const hasErrors = (): boolean => {
    return errors.name.length > 0 || errors.phone.length > 0
  }

  const resetErrors = () => {
    setErrors({name: '', phone: ''})
  }
  const resetFields = () => {
    setPhone('')
    setName('')
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
          title={isSignup ? 'Sign up' : 'Login'}
        >
          <div className="w-full m-auto">
            <div>
              {/* {isSignup && (
                <div>
                  <Input
                    name="name"
                    label="Full name"
                    onChange={onNameChange}
                    value={name}
                    size="lg"
                    error={errors.name}
                  ></Input>
                </div>
              )} */}
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
              <div className="mt-5">
                <Button
                  disabled={hasErrors()}
                  variant="primary"
                  onClick={sendOneTimePassword}
                  label="Send One Time Password"
                />
              </div>
            </div>

            {/* <div className="text-center mb-4  mt-5 flex justify-center items-center">
              <div className="border-b border-b-[#FDC002] w-1/2 mb-1 mr-1"></div>
              <div className="mb-2">Or</div>
              <div className="border-b border-b-[#FDC002] w-1/2 mb-1 ml-1"></div>
            </div>
            <div>
              <GoogleSignInButton
                onClick={() => (window.location.href = '/auth/google')}
              />
            </div> */}

            {!isSignup && (
              <div className="py-4 mt-4 text-center">
                New to RentAcross?{' '}
                <span>
                  <Link href="#" className="text-[orange]" onClick={onSignup}>
                    Create account
                  </Link>
                </span>
              </div>
            )}

            {isSignup && (
              <div className="py-4 mt-4 text-center">
                Already have an account?{' '}
                <span>
                  <Link href="#" className="text-[orange]" onClick={onLogin}>
                    Sign in
                  </Link>
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {otpSent && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={'OTP Verification'}
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
