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
  const [isLoading, setIsLoading] = useState(false)

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {}, [loggedUser])

  const handleCloseModal = () => {
    setShowModal(false)
    onClose()
  }

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
    setIsLoading(true)
    try {
      const response: any = await generateLoginOTP(phone, false)
      if (response.success) {
        setOtpSent(true)
        setOtpExpiry(response.expiryTimeInSeconds)
        trackGAEvent(GA_EVENTS.FORM_SUBMIT, {phone})
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (hasErrors()) {
      return
    }
    setIsLoading(true)
    try {
      const loggedUser: IUser = await loginWithOTP(phone, otp)
      if (loggedUser?.id) {
        dispatch(authUser(loggedUser))
        trackGAEvent(GA_EVENTS.LOGIN, {method: 'phone'})
        onClose()
      }
    } catch (error) {
      console.error('Error logging in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = '/auth/google'
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
          title={'Welcome'}
          logoTitle={true}
          fullScreen={isMobile}
        >
          <div
            className={`${isMobile ? 'flex-1 flex flex-col justify-center px-6' : 'm-auto'}`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-left space-y-2">
                <h1 className="text-lg font-normal text-gray-900">
                  <span className="font-semibold">Login</span> or{' '}
                  <span className="font-semibold">Signup</span>
                </h1>
              </div>

              {/* Phone Input - Primary Method */}
              <div className="space-y-4">
                <Input
                  name="phone"
                  label="Phone number"
                  iconType={INPUT_ICON_TYPES.PHONE}
                  onChange={onPhoneChange}
                  value={phone}
                  size="lg"
                  error={errors.phone}
                  placeholder="Enter your 10-digit phone number"
                />

                <Button
                  disabled={!isPhoneValid() || isLoading}
                  variant="primary"
                  onClick={sendOneTimePassword}
                  label={isLoading ? 'Sending...' : 'Send OTP'}
                />
              </div>

              {/* Google Sign-In - Secondary Option */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="text-center">
                  <GoogleSignInButton onClick={handleGoogleSignIn} />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Quick</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Trusted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {otpSent && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={'Verify OTP'}
          logoTitle={true}
          fullScreen={isMobile}
        >
          <div
            className={`${isMobile ? 'flex-1 flex flex-col justify-center px-6' : 'm-auto'}`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Verify your phone
                </h1>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to {phone}
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-4">
                <OTPInput onChange={otp => onOTPChange(otp)} />

                <Button
                  variant="primary"
                  onClick={handleLogin}
                  label={isLoading ? 'Verifying...' : 'Verify & Continue'}
                  disabled={otp.length !== 6 || isLoading}
                />
              </div>

              {/* Timer and Resend */}
              <div className="text-center space-y-4">
                {otpExpiry > 0 && (
                  <div className="text-sm text-gray-600">
                    <CountdownTimer
                      seconds={otpExpiry}
                      onTimeUp={onOtpTimeout}
                    />
                  </div>
                )}

                {otpExpiry === 0 && (
                  <div className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      onClick={sendOneTimePassword}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                      disabled={isLoading}
                    >
                      Resend code
                    </button>
                  </div>
                )}
              </div>

              {/* Back to phone input */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setOtpSent(false)
                    setOtp('')
                    setOtpExpiry(0)
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Use different phone number
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
