import {useState, useEffect} from 'react'
import Script from 'next/script'
import {DIGILOCKER_CONFIG} from '../config/digilocker.config'

// Declare the global DigiboostWebSDK type
declare global {
  interface Window {
    DigiboostWebSDK: any
  }
}

export const useDigiLockerSDK = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If SDK is already loaded, mark as initialized
    if (typeof window !== 'undefined' && window.DigiboostWebSDK) {
      console.log('DigiLocker SDK already loaded')
      setIsInitialized(true)
      return
    }

    // If we're not in browser environment, return
    if (typeof window === 'undefined') {
      return
    }

    setIsLoading(true)
    setError(null)

    // Check periodically for SDK availability
    const checkSDK = () => {
      if (window.DigiboostWebSDK) {
        console.log('DigiLocker SDK is available:', window.DigiboostWebSDK)
        setIsInitialized(true)
        setIsLoading(false)
        setError(null)
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
    }, 100)

    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
      setError('SDK load timeout - please refresh the page')
    }, 15000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const DigiLockerScript = () => (
    <Script
      src={DIGILOCKER_CONFIG.SDK_URL}
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('DigiLocker SDK script loaded via Next.js Script')
      }}
      onError={() => {
        console.error('Failed to load DigiLocker SDK via Next.js Script')
        setError('Failed to load DigiLocker SDK')
        setIsLoading(false)
      }}
    />
  )

  return {isInitialized, error, isLoading, DigiLockerScript}
}
