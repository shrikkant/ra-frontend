'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSelector} from 'react-redux'
import MobileChrome from '../MobileChrome'
import Stepper from '../cart/Stepper'
import {useSignIn} from '../../../../hooks/useSignIn'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {getLastLink} from '../../../../app-store/session/session.slice'
import {isVerified, VERIFICATION_FLAGS} from '../../../../config/constants'
import {CheckIcon} from '../icons'
import GoogleSignInButton from '../../../../components/common/GoogleSignInBtn'

const OTP_LENGTH = 6
const RESEND_SECONDS = 28

export default function JoinScreen() {
  const router = useRouter()
  const lastLink = useSelector(getLastLink)
  const loggedUser = useSelector(selectAuthState)

  const redirectAfterAuth = useCallback(() => {
    const target =
      lastLink && lastLink.length > 0
        ? lastLink
        : loggedUser &&
            !isVerified(loggedUser.verified, VERIFICATION_FLAGS.PHONE)
          ? '/kyc-verification'
          : '/'
    router.push(target)
  }, [router, lastLink, loggedUser])

  const {state, handlers, validators} = useSignIn(redirectAfterAuth)

  return (
    <MobileChrome hideTabBar bottomPad="none" width="narrow">
      <div className="md:mt-12 md:bg-surface md:border md:border-line-soft md:rounded-[20px] md:p-6 md:shadow-card-hover">
      <Stepper
        step={state.otpSent ? 2 : 1}
        total={2}
        title={state.otpSent ? 'Verify code' : 'Sign in'}
        onBack={() => {
          if (state.otpSent) handlers.resetOtpForm()
          else router.push('/')
        }}
      />

      <div className="px-4 md:px-0 pt-5">
        {!state.otpSent ? (
          <PhoneStep
            phone={state.phone}
            error={state.errors.phone}
            onChange={handlers.handlePhoneChange}
            onSend={handlers.sendOTP}
            valid={validators.isPhoneValid()}
            loading={state.isLoading}
            onGoogleCredential={handlers.handleGoogleCredential}
          />
        ) : (
          <OtpStep
            phone={state.phone}
            otp={state.otp}
            error={state.errors.phone}
            onChange={handlers.handleOtpChange}
            onVerify={handlers.verifyOTP}
            onBack={handlers.resetOtpForm}
            loading={state.isLoading}
          />
        )}
      </div>
      </div>
    </MobileChrome>
  )
}

// ── Phone step ────────────────────────────────────────────────────────────

function PhoneStep({
  phone,
  error,
  onChange,
  onSend,
  valid,
  loading,
  onGoogleCredential,
}: {
  phone: string
  error?: string
  onChange: (phone: string) => void
  onSend: () => void
  valid: boolean
  loading: boolean
  onGoogleCredential: (credential: string) => void
}) {
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, ''))
  }

  return (
    <>
      <h1 className="text-[34px] font-extrabold tracking-tight-lg leading-[0.98] text-ink">
        Sign in to
        <br />
        rent gear.
      </h1>

      <div className="mt-6">
        <label
          htmlFor="join-phone"
          className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted"
        >
          Phone number
        </label>
        <div
          className={`mt-2 h-14 flex items-center rounded-[18px] bg-surface border ${
            valid ? 'border-ink' : 'border-line'
          }`}
        >
          <div className="px-4 flex items-center gap-1.5">
            <span aria-hidden className="text-[16px]">
              🇮🇳
            </span>
            <span className="font-mono font-bold text-ink">+91</span>
          </div>
          <div
            aria-hidden
            className="w-px h-7 bg-line"
          />
          <input
            id="join-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            pattern="[0-9]*"
            maxLength={10}
            value={phone}
            onChange={onInput}
            placeholder="98765 43210"
            className="flex-1 min-w-0 bg-transparent pl-3 pr-2 font-mono text-[16px] text-ink placeholder:text-ink-subtle outline-none"
          />
          {valid && (
            <div className="pr-3">
              <span
                aria-hidden
                className="w-7 h-7 rounded-full bg-accent flex items-center justify-center"
              >
                <CheckIcon size={16} strokeWidth={3} className="text-ink" />
              </span>
            </div>
          )}
        </div>
        {error && (
          <div role="alert" className="mt-2 text-[12px] text-danger">
            {error}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSend}
        disabled={!valid || loading}
        className={`w-full mt-5 text-[14px] font-extrabold rounded-full py-3.5 transition-colors ${
          valid
            ? 'bg-ink text-surface hover:bg-accent hover:text-ink'
            : 'bg-surface-muted text-ink-muted'
        } disabled:opacity-70`}
      >
        {loading ? 'Sending…' : 'Send code'}
      </button>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-line" />
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          Or continue with
        </div>
        <div className="flex-1 h-px bg-line" />
      </div>

      <div className="mt-4">
        <GoogleSignInButton onCredential={onGoogleCredential} />
      </div>
    </>
  )
}

// ── OTP step ─────────────────────────────────────────────────────────────

function OtpStep({
  phone,
  otp,
  error,
  onChange,
  onVerify,
  onBack,
  loading,
}: {
  phone: string
  otp: string
  error?: string
  onChange: (v: string) => void
  onVerify: () => void
  onBack: () => void
  loading: boolean
}) {
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  // A single underlying input backs the six visual boxes. Split inputs
  // (one per digit) race on iOS/Android SMS-code autofill: the OS sets
  // each box's value and fires events faster than React reconciles the
  // controlled inputs, so digits get dropped/scrambled (919805 → 9905).
  // One field is filled atomically — and paste "just works" too.
  const inputRef = useRef<HTMLInputElement | null>(null)
  // Track the last OTP value we auto-submitted so a failed verification
  // doesn't relaunch on every render while 6 digits remain in the box.
  const lastSubmittedOtpRef = useRef<string | null>(null)

  useEffect(() => {
    if (countdown <= 0) return
    const t = window.setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => window.clearInterval(t)
  }, [countdown])

  // Focus the code field when the step appears so the keyboard opens and
  // the SMS-code suggestion surfaces without a manual tap. Deferred a
  // frame so the input is painted before we focus. iOS may still gate the
  // keyboard on a user gesture, but the field is focused and tapping the
  // row (the input overlays it) opens it reliably.
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (
      otp.length === OTP_LENGTH &&
      !loading &&
      lastSubmittedOtpRef.current !== otp
    ) {
      lastSubmittedOtpRef.current = otp
      onVerify()
    }
  }, [otp, loading, onVerify])

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))
  }

  const maskedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  const mm = Math.floor(countdown / 60)
  const ss = String(countdown % 60).padStart(2, '0')

  return (
    <>
      <h1 className="text-[32px] font-extrabold tracking-tight-lg leading-[1] text-ink">
        Enter the code
      </h1>
      <p className="text-[14px] text-ink-secondary mt-1.5">
        Sent to <span className="font-bold text-ink">{maskedPhone}</span>
      </p>

      <div className="mt-6 relative">
        {/* The real, single input — transparent and overlaying the boxes so
            a tap anywhere on the row focuses it. SMS-code autofill and paste
            land here atomically. */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={onInput}
          aria-label="Enter the 6-digit verification code"
          className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="grid grid-cols-6 gap-2" aria-hidden>
          {Array.from({length: OTP_LENGTH}).map((_, i) => {
            const value = otp[i] ?? ''
            // Highlight filled boxes plus the next box to fill (the caret).
            const active = value !== '' || i === otp.length
            return (
              <div
                key={i}
                className={`h-[72px] rounded-[14px] bg-surface flex items-center justify-center font-mono text-[22px] font-extrabold text-ink border-2 ${
                  active ? 'border-ink' : 'border-line'
                }`}
              >
                {value}
              </div>
            )
          })}
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-3 text-[12px] text-danger">
          {error}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={onBack}
          className="text-ink-secondary font-semibold"
        >
          ← Change number
        </button>
        {countdown > 0 ? (
          <span className="font-mono text-ink-muted">
            Resend in {mm}:{ss}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setCountdown(RESEND_SECONDS)}
            className="font-bold text-ink"
          >
            Resend code
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onVerify}
        disabled={otp.length !== OTP_LENGTH || loading}
        className="w-full mt-6 bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-60"
      >
        {loading ? 'Verifying…' : 'Verify & continue'}
      </button>
    </>
  )
}
