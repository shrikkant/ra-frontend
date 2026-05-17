'use client'

import React, {useEffect, useRef, useState} from 'react'
import Script from 'next/script'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../../../app-store/auth/auth.slice'
import {VERIFICATION_FLAGS, isVerified} from '../../../../../config/constants'
import {useDigiLockerVerification} from '../../../../../hooks/useDigiLockerVerification'
import {DIGILOCKER_CONFIG} from '../../../../../config/digilocker.config'
import StepCard, {Spinner} from './StepCard'
import {ShieldIcon} from '../../icons'

declare global {
  interface Window {
    DigiboostSdk: any
  }
}

export default function DigilockerCard() {
  const user = useSelector(selectAuthState)
  const verified = isVerified(user?.verified || 0, VERIFICATION_FLAGS.AADHAAR)

  const {
    isLoading,
    verificationData,
    error,
    buttonRef,
    initializeVerification,
    launchVerification,
    sdkButtonReady,
    verificationStatus,
    statusMessage,
    awaitingConfirmation,
  } = useDigiLockerVerification()

  const [sdkReady, setSdkReady] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const initRequested = useRef(false)

  // Detect SDK availability by polling `window.DigiboostSdk` on every mount.
  // This is the fix for the "script doesn't load on client-side navigation"
  // bug: next/script's `onLoad` does not fire reliably on a route change or
  // when the script is already cached. Polling catches both cases.
  useEffect(() => {
    if (verified) return
    if (typeof window !== 'undefined' && window.DigiboostSdk) {
      setSdkReady(true)
      return
    }
    let attempts = 0
    const interval = setInterval(() => {
      attempts += 1
      if (typeof window !== 'undefined' && window.DigiboostSdk) {
        setSdkReady(true)
        setSdkError(null)
        clearInterval(interval)
      } else if (attempts >= 50) {
        clearInterval(interval)
        setSdkError(
          'Could not load the verification service. Please refresh and try again.',
        )
      }
    }, 300)
    return () => clearInterval(interval)
  }, [verified])

  // Pre-initialise in the background as soon as the SDK is ready. This
  // fetches the token and renders the SDK launch button up front, so the
  // user's single "Complete KYC" click can open DigiLocker directly —
  // synchronously, within the gesture — instead of revealing a second button.
  useEffect(() => {
    if (verified || !sdkReady || initRequested.current) return
    if (!verificationData && !isLoading && !error) {
      initRequested.current = true
      initializeVerification()
    }
  }, [verified, sdkReady, verificationData, isLoading, error, initializeVerification])

  if (verified) {
    return (
      <StepCard
        status="done"
        icon={<ShieldIcon size={20} />}
        title="KYC verification"
        subtitle="Your Aadhaar identity is confirmed."
      />
    )
  }

  const showError = error || sdkError
  const launchReady = sdkReady && !!verificationData && sdkButtonReady
  const inProgress = verificationStatus === 'IN_PROGRESS'
  const completed = verificationStatus === 'COMPLETED'

  return (
    <StepCard
      status="todo"
      icon={<ShieldIcon size={20} />}
      title="KYC verification"
      subtitle="Instant Aadhaar verification via DigiLocker — takes about a minute."
    >
      {/* SDK injection. Readiness comes from the mount poll above, so no
          onLoad handler is needed — only error handling. */}
      <Script
        src={DIGILOCKER_CONFIG.SDK_URL}
        strategy="afterInteractive"
        onError={() =>
          setSdkError(
            'Could not load the verification service. Please refresh and try again.',
          )
        }
      />

      {/* The SDK renders its launch button here. Kept off-screen but in the
          DOM so `launchVerification()` can click it within the user gesture. */}
      <div className="h-0 overflow-hidden" aria-hidden>
        <div id="digilocker-button" ref={buttonRef} />
      </div>

      {showError && (
        <div className="bg-danger/10 border border-danger/25 rounded-[12px] p-3 mb-3">
          <p className="text-[12px] text-danger font-medium">{showError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-[12px] font-extrabold text-danger underline mt-1"
          >
            Refresh page
          </button>
        </div>
      )}

      {completed ? (
        <div className="bg-success/10 border border-success/25 rounded-[12px] p-3 flex items-center gap-2.5">
          <Spinner dark />
          <p className="text-[12px] text-success font-medium">
            Verification complete — updating your profile…
          </p>
        </div>
      ) : awaitingConfirmation ? (
        <div className="bg-surface-muted rounded-[12px] p-3 flex items-center gap-2.5">
          <Spinner dark />
          <p className="text-[12px] text-ink-secondary">
            {statusMessage || 'Verifying your details, please wait…'}
          </p>
        </div>
      ) : inProgress ? (
        <div>
          <div className="bg-surface-muted rounded-[12px] p-3 flex items-center gap-2.5 mb-2">
            <Spinner dark />
            <p className="text-[12px] text-ink-secondary">
              {statusMessage ||
                'Complete the verification in the DigiLocker window…'}
            </p>
          </div>
          <button
            type="button"
            onClick={launchVerification}
            className="text-[12px] font-extrabold text-ink underline"
          >
            Didn&apos;t open? Reopen DigiLocker
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={launchVerification}
          disabled={!launchReady}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {!launchReady && !showError && <Spinner />}
          {showError
            ? 'Verification unavailable'
            : launchReady
              ? 'Complete KYC'
              : 'Preparing secure verification…'}
        </button>
      )}
    </StepCard>
  )
}
