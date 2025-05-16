'use client'

import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from '../../app-store/auth/auth.slice'
import {updateEmail, verifyEmailOTP} from '../../api/user/index.api'
import {IUser} from '../../app-store/types'
import {useRouter} from 'next/navigation'
import Input from '../common/form/Input'
import Button from '../common/form/Button'
import {FaCheckCircle} from 'react-icons/fa'
import {VERIFICATION_FLAGS, isVerified} from '../../config/constants'

export default function VerifyEmail() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [otp, setOtp] = React.useState('')
  const [otpSent, setOtpSent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const user = useSelector(selectAuthState)

  const dispatch = useDispatch()

  // Don't show email verification for Google or Facebook signins
  if (user?.signin_source === 'G' || user?.signin_source === 'F') {
    return null
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
  }

  const handleOTPChange = (value: string) => {
    setOtp(value)
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const submitEmail = async () => {
    if (!isValidEmail(email)) {
      return
    }
    setIsLoading(true)
    try {
      const updateUser: IUser = await updateEmail(email)
      setOtpSent(true)
    } catch (error) {
      console.error('Failed to submit email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    setIsLoading(true)
    try {
      const updateUser: IUser = await verifyEmailOTP(otp)
      dispatch(authUser(updateUser))
      router.push('/')
    } catch (error) {
      console.error('Failed to verify OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified(user?.verified || 0, VERIFICATION_FLAGS.EMAIL)) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Email</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
            <FaCheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Email</h3>
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
              label="Email Address"
              type="email"
              onChange={handleInputChange}
              value={email}
              size="lg"
            />
            <Button
              variant="primary"
              label="Send OTP"
              onClick={submitEmail}
              isLoading={isLoading}
              disabled={!isValidEmail(email)}
            />
          </>
        ) : (
          <>
            <Input
              label="OTP"
              type="text"
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
  )
}
