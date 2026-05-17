'use client'

import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from '../../../../../app-store/auth/auth.slice'
import {updateEmail, verifyEmailOTP} from '../../../../../api/user/index.api'
import {IUser} from '../../../../../app-store/types'
import {VERIFICATION_FLAGS, isVerified} from '../../../../../config/constants'
import {displayMessage} from '../../../../../util/global.util'
import {MESSAGE_TYPES} from '../../../../../util/messageTypes'
import StepCard, {Spinner} from './StepCard'

function MailIcon({size = 20}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 6.5l9 6 9-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as
    | {response?: {data?: {message?: string}}; message?: string}
    | undefined
  return err?.response?.data?.message || err?.message || fallback
}

const inputClass =
  'w-full bg-surface border border-line rounded-[12px] px-3.5 py-3 text-[14px] text-ink placeholder:text-ink-muted focus:border-ink outline-none transition-colors'

export default function EmailCard() {
  const user = useSelector(selectAuthState)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSocial =
    user?.signin_source === 'G' || user?.signin_source === 'F'
  const verified =
    isVerified(user?.verified || 0, VERIFICATION_FLAGS.EMAIL) || isSocial

  if (verified) {
    return (
      <StepCard
        status="done"
        icon={<MailIcon />}
        title="Email verification"
        subtitle={
          isSocial
            ? 'Verified through your social login.'
            : `${user?.email_address || 'Your email'} is verified.`
        }
      />
    )
  }

  const submitEmail = async () => {
    if (!isValidEmail(email)) return
    setLoading(true)
    try {
      await updateEmail(email)
      setOtpSent(true)
      displayMessage(MESSAGE_TYPES.SUCCESS, `OTP sent to ${email}`)
    } catch (error) {
      console.error('Failed to submit email:', error)
      displayMessage(
        MESSAGE_TYPES.ERROR,
        extractErrorMessage(error, 'Could not send OTP. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    try {
      const updatedUser: IUser = await verifyEmailOTP(otp)
      dispatch(authUser(updatedUser))
      displayMessage(MESSAGE_TYPES.SUCCESS, 'Email verified successfully')
    } catch (error) {
      console.error('Failed to verify OTP:', error)
      displayMessage(
        MESSAGE_TYPES.ERROR,
        extractErrorMessage(error, 'Invalid or expired OTP. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepCard
      status="todo"
      icon={<MailIcon />}
      title="Email verification"
      subtitle="We'll send a one-time code to confirm your email."
    >
      {!otpSent ? (
        <div className="space-y-3">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={submitEmail}
            disabled={!isValidEmail(email) || loading}
            className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            className={`${inputClass} tracking-[0.3em] font-mono`}
          />
          <button
            type="button"
            onClick={verifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            Verify OTP
          </button>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={submitEmail}
              disabled={loading}
              className="text-[12px] font-extrabold text-ink underline disabled:opacity-50"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false)
                setOtp('')
              }}
              disabled={loading}
              className="text-[12px] font-bold text-ink-muted underline disabled:opacity-50"
            >
              Change email
            </button>
          </div>
        </div>
      )}
    </StepCard>
  )
}
