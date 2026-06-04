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
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  // Track the last OTP value we auto-submitted so failed verifications
  // don't relaunch on every render while the user still has 6 digits in
  // the box. They have to change a digit (or hit Verify manually) to retry.
  const lastSubmittedOtpRef = useRef<string | null>(null)
  // Synchronous mirror of `otp`. iOS SMS-code autofill on split inputs
  // dispatches one input event PER box in a single batch, before React
  // re-renders — so reading the `otp` prop from each fillFrom closure sees
  // the same stale (empty) value and the digits clobber each other
  // ("89770" → "8700"). We carry the accumulating value through this ref
  // and update it synchronously so each event in the batch builds on the
  // previous one. Kept in sync with the prop for the typed/paste paths.
  const otpRef = useRef(otp)
  otpRef.current = otp

  useEffect(() => {
    if (countdown <= 0) return
    const t = window.setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => window.clearInterval(t)
  }, [countdown])

  // Auto-focus the first empty box when the code step appears so the
  // mobile keyboard opens without a manual tap. Deferred a frame so the
  // inputs are painted before we focus (a bare on-mount focus can fire
  // before the ref is attached). iOS may still gate opening the keyboard
  // on a user gesture, but Android and desktop focus reliably.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const firstEmpty = Math.min(otp.length, OTP_LENGTH - 1)
      inputsRef.current[firstEmpty]?.focus()
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Write one or more digits into the boxes starting at `i`. A single
  // digit is the normal typing case; a multi-digit string arrives from a
  // paste or an OS SMS-code autofill, which we spread across the boxes
  // instead of dropping everything but the first digit.
  const fillFrom = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '')
    // Read from the ref, not the prop: within an autofill batch the prop is
    // stale, but the ref holds what prior events in the batch just wrote.
    const next = (otpRef.current.padEnd(OTP_LENGTH, ' ').split('') as string[])
    if (digits.length === 0) {
      // Empty change = the box was cleared (e.g. delete/backspace).
      next[i] = ' '
    } else {
      for (let k = 0; k < digits.length && i + k < OTP_LENGTH; k++) {
        next[i + k] = digits[k]
      }
    }
    const joined = next.join('').replace(/ /g, '').slice(0, OTP_LENGTH)
    // Commit synchronously so the next event in the batch sees it.
    otpRef.current = joined
    onChange(joined)
    // Focus the box after the last one we filled, capped at the final box.
    const landed = Math.min(i + Math.max(digits.length, 1), OTP_LENGTH) - 1
    inputsRef.current[landed]?.focus()
  }

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (/\d/.test(text)) {
      // Read the clipboard ourselves — maxLength={1} would otherwise clip
      // the pasted value to a single character before onChange sees it.
      e.preventDefault()
      fillFrom(i, text)
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
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={OTP_LENGTH}
              value={value}
              onChange={e => fillFrom(i, e.target.value)}
              onPaste={e => onPaste(i, e)}
              onKeyDown={e => onKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className={`h-[72px] rounded-[14px] bg-surface text-center font-mono text-[22px] font-extrabold text-ink outline-none border-2 ${
                active ? 'border-ink' : 'border-line'
              } focus:border-ink`}
            />
          )
        })}
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
