'use client'

import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Input from '../common/form/Input'
import Button from '../common/form/Button'
import OTPInput from '../user/OTPInput'
import {INPUT_ICON_TYPES} from '../../config/constants'
import {generateLoginOTP, loginWithOTP} from '../../api/user/index.api'
import {authUser} from '../../app-store/auth/auth.slice'
import {getUTMData} from '../../app-store/session/session.slice'
import {GA_EVENTS, trackGAEvent} from '../../utils/analytics'
import {IUser} from '../../app-store/types'

interface InlineSignupCaptureProps {
  onComplete: () => void
  onSkip: () => void
  productName?: string
}

type CaptureStep = 'success' | 'phone' | 'otp'

const HOLD_TIME_SECONDS = 15 * 60 // 15 minutes

export const InlineSignupCapture: React.FC<InlineSignupCaptureProps> = ({
  onComplete,
  onSkip,
}) => {
  const dispatch = useDispatch()
  const utmData = useSelector(getUTMData)

  const [step, setStep] = useState<CaptureStep>('success')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(0)
  const [holdTimeLeft, setHoldTimeLeft] = useState(HOLD_TIME_SECONDS)
  const [showSuccess, setShowSuccess] = useState(true)

  // Auto-transition from success to phone after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('phone')
      setShowSuccess(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Hold time countdown
  useEffect(() => {
    if (holdTimeLeft <= 0) return
    const interval = setInterval(() => {
      setHoldTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [holdTimeLeft])

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry <= 0) return
    const interval = setInterval(() => {
      setOtpExpiry(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [otpExpiry])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value)
      setPhoneError('')
    }
  }

  const isPhoneValid = phone.length === 10

  const handleSendOTP = async () => {
    if (!isPhoneValid) {
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    try {
      const response: any = await generateLoginOTP(phone, false)
      if (response.success) {
        setStep('otp')
        setOtpExpiry(response.expiryTimeInSeconds || 120)
        trackGAEvent(GA_EVENTS.FORM_SUBMIT, {
          form: 'inline_signup_phone',
          phone: phone,
        })
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setPhoneError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const loggedUser: IUser = await loginWithOTP(phone, otp, utmData)
      if (loggedUser?.id) {
        dispatch(authUser(loggedUser))
        trackGAEvent(GA_EVENTS.LOGIN, {
          method: 'phone_inline',
          source: 'add_to_cart',
        })
        onComplete()
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setOtpError('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp('')
    setOtpError('')
    await handleSendOTP()
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp('')
    setOtpError('')
    setOtpExpiry(0)
  }

  return (
    <div className="relative min-h-[350px]">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white z-10 flex items-center justify-center animate-fade-out">
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Added to Cart!</h3>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-300 ${showSuccess ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Header with urgency */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Great choice!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your rental dates are held for{' '}
                <span className="font-semibold text-amber-600">
                  {formatTime(holdTimeLeft)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h4 className="text-base font-semibold text-gray-900">
                Secure your booking
              </h4>
            </div>

            <div>
              <Input
                name="phone"
                label="Phone number"
                iconType={INPUT_ICON_TYPES.PHONE}
                onChange={handlePhoneChange}
                value={phone}
                size="lg"
                error={phoneError}
                inputMode="numeric"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSendOTP}
              label={isLoading ? 'Sending OTP...' : 'Send OTP & Continue'}
              disabled={!isPhoneValid || isLoading}
            />

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Quick checkout</span>
              </div>
            </div>

            {/* Skip Option */}
            {/* <div className="text-center pt-2">
              <button
                onClick={onSkip}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
              >
                Skip for now
              </button>
            </div> */}
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-5">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900">
                Verify your phone
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Enter the 6-digit code sent to{' '}
                <span className="font-medium text-gray-700">+91 {phone}</span>
              </p>
            </div>

            <div className="flex justify-center">
              <OTPInput onChange={setOtp} />
            </div>

            {otpError && (
              <p className="text-center text-sm text-red-600">{otpError}</p>
            )}

            <Button
              variant="primary"
              onClick={handleVerifyOTP}
              label={isLoading ? 'Verifying...' : 'Verify & Continue'}
              disabled={otp.length !== 6 || isLoading}
            />

            {/* Timer and Resend */}
            <div className="text-center text-sm">
              {otpExpiry > 0 ? (
                <p className="text-gray-500">
                  Resend code in{' '}
                  <span className="font-medium text-gray-700">
                    {formatTime(otpExpiry)}
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Back to phone */}
            <div className="text-center">
              <button
                onClick={handleBackToPhone}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Change phone number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
