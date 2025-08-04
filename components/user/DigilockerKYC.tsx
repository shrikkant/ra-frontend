'use client'

import React, {useState, useEffect} from 'react'
import Script from 'next/script'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../app-store/auth/auth.slice'
import {VERIFICATION_FLAGS, isVerified} from '../../config/constants'
import {useDigiLockerVerification} from '../../hooks/useDigiLockerVerification'
import Button from '../common/form/Button'
import {FaCheckCircle, FaIdCard, FaRedo} from 'react-icons/fa'
import {DIGILOCKER_CONFIG} from '../../config/digilocker.config'

// Declare the global DigiboostWebSDK type
declare global {
  interface Window {
    DigiboostSdk: any
  }
}

export default function DigilockerKYC() {
  const user = useSelector(selectAuthState)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const {
    isLoading,
    verificationData,
    error,
    buttonRef,
    initializeVerification,
  } = useDigiLockerVerification()

  // Check for SDK availability periodically
  useEffect(() => {
    if (scriptLoaded) {
      console.log('Script loaded, checking for SDK availability...')

      const checkSDK = () => {
        if (typeof window !== 'undefined' && window.DigiboostSdk) {
          console.log('SDK found:', window.DigiboostSdk)
          setSdkLoaded(true)
          setSdkError(null)
          return true
        }
        return false
      }

      // Initial check
      if (checkSDK()) return

      // Set up periodic checking
      const interval = setInterval(() => {
        if (checkSDK()) {
          clearInterval(interval)
        }
      }, 500)

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval)
        if (!sdkLoaded) {
          console.error('SDK not available after script load')
          setSdkError('SDK failed to initialize after script load')
        }
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [scriptLoaded, sdkLoaded])

  const handleRetry = () => {
    // Force page reload to retry SDK loading
    window.location.reload()
  }

  const handleScriptLoad = () => {
    console.log('DigiLocker SDK script loaded via Next.js Script')
    setScriptLoaded(true)
    setSdkError(null)
  }

  const handleScriptError = () => {
    console.error('Failed to load DigiLocker SDK via Next.js Script')
    setSdkError('Failed to load DigiLocker SDK')
    setScriptLoaded(false)
  }

  if (isVerified(user?.verified || 0, VERIFICATION_FLAGS.AADHAAR)) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">KYC Status</h3>
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
      {/* Load DigiLocker SDK */}
      <Script
        src={DIGILOCKER_CONFIG.SDK_URL}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        onReady={() => {
          console.log('Script ready event fired')
        }}
      />

      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">KYC Verification</h3>
        {verificationData && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )}
      </div>

      <div className="space-y-4">
        {(error || sdkError) && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span>{error || sdkError}</span>
              {(error || sdkError)?.includes('SDK') && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  <FaRedo className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {!verificationData ? (
          <div className="space-y-4">
            <Button
              variant="primary"
              label="Complete KYC"
              onClick={initializeVerification}
              isLoading={isLoading}
              disabled={!sdkLoaded}
            />

            {!scriptLoaded && (
              <p className="text-xs text-gray-500 text-center">
                Loading DigiLocker SDK script...
              </p>
            )}

            {scriptLoaded && !sdkLoaded && (
              <p className="text-xs text-gray-500 text-center">
                Initializing DigiLocker SDK...
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Verification initialized. Click the button below to proceed with
              DigiLocker verification:
            </p>
            <div id="digilocker-button" ref={buttonRef}></div>
            {!sdkLoaded && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Loading DigiLocker SDK...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
