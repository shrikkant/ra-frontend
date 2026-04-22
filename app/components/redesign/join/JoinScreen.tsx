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
    <MobileChrome hideTabBar bottomPad="none">
      <Stepper
        step={state.otpSent ? 2 : 1}
        total={2}
        title={state.otpSent ? 'Verify code' : 'Sign in'}
        onBack={() => {
          if (state.otpSent) handlers.resetOtpForm()
          else router.push('/')
        }}
      />

      <div className="px-4 pt-5">
        {!state.otpSent ? (
          <PhoneStep
            phone={state.phone}
            onChange={handlers.handlePhoneChange}
            onSend={handlers.sendOTP}
            valid={validators.isPhoneValid()}
            loading={state.isLoading}
            onGoogle={handlers.handleGoogleSignIn}
          />
        ) : (
          <OtpStep
            phone={state.phone}
            otp={state.otp}
            onChange={handlers.handleOtpChange}
            onVerify={handlers.verifyOTP}
            onBack={handlers.resetOtpForm}
            loading={state.isLoading}
          />
        )}
      </div>
    </MobileChrome>
  )
}

// ── Phone step ────────────────────────────────────────────────────────────

function PhoneStep({
  phone,
  onChange,
  onSend,
  valid,
  loading,
  onGoogle,
}: {
  phone: string
  onChange: (phone: string) => void
  onSend: () => void
  valid: boolean
  loading: boolean
  onGoogle: () => void
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

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onGoogle}
          className="flex items-center justify-center gap-2 bg-surface border border-line rounded-full py-3 text-[13px] font-bold text-ink"
        >
          <GoogleGlyph />
          Google
        </button>
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 bg-surface border border-line rounded-full py-3 text-[13px] font-bold text-ink-muted"
        >
          <AppleGlyph />
          Apple
        </button>
      </div>
    </>
  )
}

function GoogleGlyph() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 48 48"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.1 13.1 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.42 3.29l6.31-6.31C34.9 4.15 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7C13.42 14.62 18.27 10.75 24 10.75z"
      />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.823.99-2.175 1.73-3.26 1.63-.141-1.11.404-2.24 1.1-2.98.79-.87 2.12-1.52 3.337-1.73zm3.81 17.11c-.526 1.22-1.16 2.37-2.18 2.39-1.03.02-1.36-.6-2.53-.6-1.18 0-1.54.57-2.51.62-1 .04-1.77-1.3-2.3-2.5-1.07-2.24-1.9-6.33.79-9.1.89-.93 2.48-1.52 3.23-1.54 1.01-.02 1.96.68 2.58.68.61 0 1.76-.84 2.98-.72.51.02 1.97.2 2.92 1.54-.08.05-1.76 1.03-1.74 3.06.02 2.42 2.12 3.23 2.14 3.24-.01.05-.33 1.14-1.11 2.25z" />
    </svg>
  )
}

// ── OTP step ─────────────────────────────────────────────────────────────

function OtpStep({
  phone,
  otp,
  onChange,
  onVerify,
  onBack,
  loading,
}: {
  phone: string
  otp: string
  onChange: (v: string) => void
  onVerify: () => void
  onBack: () => void
  loading: boolean
}) {
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = window.setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => window.clearInterval(t)
  }, [countdown])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (otp.length === OTP_LENGTH && !loading) {
      onVerify()
    }
  }, [otp, loading, onVerify])

  const setDigit = (i: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 1)
    const next = (otp.padEnd(OTP_LENGTH, ' ').split('') as string[])
    next[i] = clean || ' '
    const joined = next.join('').replace(/\s+$/, '').replace(/ /g, '')
    onChange(joined.slice(0, OTP_LENGTH))
    if (clean && i < OTP_LENGTH - 1) {
      inputsRef.current[i + 1]?.focus()
    }
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
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

      <div className="mt-6 grid grid-cols-6 gap-2">
        {Array.from({length: OTP_LENGTH}).map((_, i) => {
          const value = otp[i] ?? ''
          const active = value !== ''
          return (
            <input
              key={i}
              ref={el => {
                inputsRef.current[i] = el
              }}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value}
              onChange={e => setDigit(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className={`h-[72px] rounded-[14px] bg-surface text-center font-mono text-[22px] font-extrabold text-ink outline-none border-2 ${
                active ? 'border-ink' : 'border-line'
              } focus:border-ink`}
            />
          )
        })}
      </div>

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
