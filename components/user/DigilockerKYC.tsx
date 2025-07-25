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
          <h3 className="font-medium text-lg">DigiLocker KYC</h3>
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
        <h3 className="font-medium text-lg">DigiLocker KYC</h3>
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
            <div className="flex items-center gap-3 mb-4">
              <FaIdCard className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Quick KYC Verification
                </h4>
                <p className="text-sm text-gray-600">
                  Complete your verification using DigiLocker in just a few
                  clicks
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              label="Start DigiLocker KYC"
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

            {/* Debug information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                <p>Debug Info:</p>
                <p>Script Loaded: {scriptLoaded ? 'Yes' : 'No'}</p>
                <p>SDK Loaded: {sdkLoaded ? 'Yes' : 'No'}</p>
                <p>
                  Window DigiboostSdk:{' '}
                  {typeof window !== 'undefined' && window.DigiboostSdk
                    ? 'Available'
                    : 'Not Available'}
                </p>
                <p>SDK URL: {DIGILOCKER_CONFIG.SDK_URL}</p>
                {/* <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/user?mode=5', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          dob: '1986-04-22',
                          yob: '1986',
                          zip: '411045',
                          gender: 'M',
                          address: {
                            po: 'N.i.a.',
                            loc: 'Balewadi',
                            vtc: 'Pune City',
                            dist: 'Pune',
                            house: 'B3-804 Nandan Prospera Gold',
                            state: 'Maharashtra',
                            street: 'Off Balewadi Highstreet',
                            country: 'India',
                            subdist: '',
                            landmark: 'Balewadi High Street',
                          },
                          care_of: null,
                          full_name: 'Shrikant Ashok Shinde',
                          father_name: null,
                          full_address:
                            'B3-804 Nandan Prospera Gold Off Balewadi Highstreet  Balewadi Pune City  Pune N.i.a. Maharashtra India',
                          profile_image:
                            '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',
                          masked_aadhaar: 'XXXXXXXX5646',
                        }),
                      })
                      const data = await response.json()
                      console.log('API Response:', data)
                    } catch (error) {
                      console.error('API Error:', error)
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Test API Call
                </button> */}
              </div>
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
