'use client'

import React, {useEffect, useState, useSyncExternalStore} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from '../../../app-store/auth/auth.slice'
import {attachPhone, generateLoginOTP} from '../../../api/user/index.api'
import OTPInput from '../../../components/user/OTPInput'
import Sheet from './Sheet'
import {getSnapshot, resolvePhoneGate, subscribe} from './phoneGateStore'

type Step = 'phone' | 'otp'

const OTP_RESEND_SECONDS = 30
const PHONE_RE = /^[6-9]\d{9}$/

/**
 * Single mount point for the just-in-time phone collection sheet.
 * Driven by [[phoneGateStore]]; any caller (currently useAddToCart)
 * calls `requirePhone()` and awaits the boolean.
 *
 * Two short-circuits before showing UI:
 *   1. User has a verified phone on file → resolve(true) immediately.
 *   2. User dismisses without verifying → resolve(false). The caller
 *      MUST abort its action; we never half-commit (e.g. add the item
 *      and just skip the welcome). That keeps the inbox-visibility
 *      promise of this whole feature.
 *
 * Mirrors [[DateConflictHost]] — one global mount, sheet portals to
 * body, callers never thread sheet state.
 */
export default function PhoneGateHost() {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState) as any
  const {open, reason} = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)

  // Short-circuit: phone already on file → resolve true without
  // surfacing the sheet at all. Guard with `open` so we don't fire on
  // mount before any caller has requested the gate.
  useEffect(() => {
    if (!open) return
    if (user?.phone && PHONE_RE.test(String(user.phone))) {
      resolvePhoneGate(true)
    }
  }, [open, user?.phone])

  // Reset state each time the sheet opens fresh. Persisting an old OTP
  // across opens would let a stale code "succeed" against a new phone
  // request.
  useEffect(() => {
    if (open) {
      setStep('phone')
      setPhone('')
      setOtp('')
      setError('')
      setBusy(false)
      setResendIn(0)
    }
  }, [open])

  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setTimeout(() => setResendIn(s => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [resendIn])

  const handlePhoneChange = (v: string) => {
    if (!/^\d*$/.test(v)) return
    setPhone(v.slice(0, 10))
    if (error) setError('')
  }

  const sendOtp = async () => {
    if (!PHONE_RE.test(phone)) {
      setError('Enter a 10-digit mobile number starting 6-9.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const resp: any = await generateLoginOTP(phone, false)
      if (resp?.success) {
        setStep('otp')
        setOtp('')
        setResendIn(OTP_RESEND_SECONDS)
      } else {
        setError("Couldn't send a code. Check the number and try again.")
      }
    } catch (err: any) {
      // The axios interceptor toasts errorMessage globally; keep the
      // inline message lighter so the two don't compete.
      const code = err?.response?.data?.resultFormatted?.code
      setError(
        code === 'phone_in_use'
          ? 'This number is already linked to another account.'
          : "Couldn't send a code. Try again.",
      )
    } finally {
      setBusy(false)
    }
  }

  const verify = async () => {
    if (!/^\d{4,6}$/.test(otp)) {
      setError('Enter the code we sent.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const updated: any = await attachPhone(phone, otp)
      if (updated?.id) {
        // Re-seat the auth slice so other parts of the app
        // (CustomerHeader, profile screens, gating checks) immediately
        // see the new phone without a page refresh.
        dispatch(authUser(updated))
        resolvePhoneGate(true)
      } else {
        setError("That code didn't verify. Try again.")
      }
    } catch (err: any) {
      const code = err?.response?.data?.resultFormatted?.code
      if (code === 'invalid_otp') {
        setError('Wrong or expired code. Resend and try again.')
      } else if (code === 'phone_in_use') {
        setError('This number is already linked to another account.')
        // Drop back to the phone step — the OTP can never succeed for
        // this number, so leaving the user on the OTP screen is a dead
        // end.
        setStep('phone')
      } else {
        setError("Couldn't verify the code. Try again.")
      }
    } finally {
      setBusy(false)
    }
  }

  const dismiss = () => resolvePhoneGate(false)

  if (!open) return null
  // Phone-on-file short-circuit hasn't fired the resolve yet on this
  // render — render nothing to avoid a 1-frame flash of the sheet.
  if (user?.phone && PHONE_RE.test(String(user.phone))) return null

  return (
    <Sheet open={open} onClose={dismiss} label="Add your mobile number">
      <div className="p-5">
        <div className="text-[20px] font-extrabold tracking-tight-md text-ink">
          One quick step
        </div>
        <p className="text-[13px] text-ink-secondary mt-2 leading-relaxed">
          {step === 'phone' ? (
            <>
              Add your mobile number so we can confirm{' '}
              {reason ? (
                <span className="font-bold text-ink">{reason}</span>
              ) : (
                'your booking'
              )}{' '}
              and reach you on WhatsApp if anything changes.
            </>
          ) : (
            <>
              Enter the 6-digit code we sent to{' '}
              <span className="font-bold text-ink">+91 {phone}</span>.
            </>
          )}
        </p>

        {step === 'phone' && (
          <>
            <label className="block mt-5">
              <span className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted">
                Mobile number
              </span>
              <div className="mt-2 flex items-center rounded-2xl border border-line bg-surface focus-within:border-ink transition-colors">
                <span className="pl-4 pr-2 text-[15px] text-ink-secondary font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  value={phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && PHONE_RE.test(phone) && !busy)
                      sendOtp()
                  }}
                  placeholder="9876543210"
                  className="flex-1 bg-transparent py-3.5 pr-4 text-[16px] text-ink outline-none"
                />
              </div>
            </label>
            {error && (
              <div className="text-[12px] text-red-600 mt-2">{error}</div>
            )}
            <button
              type="button"
              onClick={sendOtp}
              disabled={busy || !PHONE_RE.test(phone)}
              className="w-full mt-5 bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-50"
            >
              {busy ? 'Sending…' : 'Send code'}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full mt-2 text-ink-muted text-[13px] font-bold py-2"
            >
              Not now
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="mt-2">
              <OTPInput onChange={setOtp} />
            </div>
            {error && (
              <div className="text-[12px] text-red-600 text-center -mt-1">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={verify}
              disabled={busy || otp.length < 4}
              className="w-full mt-4 bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-50"
            >
              {busy ? 'Verifying…' : 'Verify & continue'}
            </button>
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError('')
                }}
                className="text-[12px] text-ink-muted font-bold"
              >
                ← Change number
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={resendIn > 0 || busy}
                className="text-[12px] text-ink font-bold disabled:text-ink-muted"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
              </button>
            </div>
          </>
        )}
      </div>
    </Sheet>
  )
}
