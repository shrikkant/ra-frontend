import React from 'react'
import Button from '../common/form/Button'
import OTPInput from './OTPInput'
import CountdownTimer from '../CountDownTimer'

interface SignInOTPFormProps {
  phone: string
  otp: string
  otpExpiry: number
  isLoading: boolean
  onOtpChange: (otp: string) => void
  onVerifyOTP: () => void
  onResendOTP: () => void
  onOtpTimeout: () => void
  onBackToPhone: () => void
}

export const SignInOTPForm: React.FC<SignInOTPFormProps> = ({
  phone,
  otp,
  otpExpiry,
  isLoading,
  onOtpChange,
  onVerifyOTP,
  onResendOTP,
  onOtpTimeout,
  onBackToPhone,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Verify your phone</h1>
        <p className="text-gray-600 text-sm">
          We&apos;ve sent a 6-digit code to {phone}
        </p>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <OTPInput onChange={onOtpChange} />

        <Button
          variant="primary"
          onClick={onVerifyOTP}
          label={isLoading ? 'Verifying...' : 'Verify & Continue'}
          disabled={otp.length !== 6 || isLoading}
        />
      </div>

      {/* Timer and Resend */}
      <div className="text-center space-y-4">
        {otpExpiry > 0 && (
          <div className="text-sm text-gray-600">
            <CountdownTimer seconds={otpExpiry} onTimeUp={onOtpTimeout} />
          </div>
        )}

        {otpExpiry === 0 && (
          <div className="text-sm text-gray-600">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={onResendOTP}
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
          onClick={onBackToPhone}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Use different phone number
        </button>
      </div>
    </div>
  )
}
