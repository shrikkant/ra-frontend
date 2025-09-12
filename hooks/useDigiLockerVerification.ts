import {useState, useRef, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useRouter} from 'next/navigation'
import {authUser} from '../app-store/auth/auth.slice'
import {IUser} from '../app-store/types'
import {
  digiLockerAPI,
  VerificationData,
  AadhaarData,
} from '../api/digilocker.api'
import {DIGILOCKER_CONFIG} from '../config/digilocker.config'
import {getAuthUser} from '../api/auth.api'

// Declare the global DigiboostWebSDK type
declare global {
  interface Window {
    DigiboostSdk: any
  }
}

export const useDigiLockerVerification = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const initializeVerification = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Initializing verification...')
      const data = await digiLockerAPI.initializeVerification()
      console.log('Verification data received:', data)
      setVerificationData(data)
    } catch (err) {
      console.error('Verification initialization error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Verification initialization failed',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSuccess = async (data: any) => {
    if (!verificationData) return
    try {
      // Download Aadhaar data
      await digiLockerAPI.handleVerification(
        verificationData.client_id,
      )
      
      // Fetch fresh user data from backend and update Redux store
      const freshUser = await getAuthUser()
      dispatch(authUser(freshUser))
      
      console.log('User verification completed and state updated')
    } catch (err) {
      console.error('Error handling verification:', err)
      setError('Failed to complete verification. Please try again.')
    }
  }

  const handleVerificationFailure = (error: any) => {
    console.error('Verification failed:', error)
    setError('Verification failed. Please try again.')
  }

  const startVerification = () => {
    console.log('=== Starting verification ===')
    console.log('verificationData:', verificationData)
    console.log('window.DigiboostSdk:', window.DigiboostSdk)
    console.log('buttonRef.current:', buttonRef.current)

    if (!verificationData) {
      setError('Verification data not available')
      return
    }

    if (!window.DigiboostSdk) {
      setError(
        'DigiLocker SDK not available. Please refresh the page and try again.',
      )
      return
    }

    if (!buttonRef.current) {
      setError('Button element not found')
      return
    }

    try {
      console.log('Creating DigiLocker SDK instance...')
      window.DigiboostSdk({
        gateway: DIGILOCKER_CONFIG.GATEWAY,
        token: verificationData.token,
        selector: DIGILOCKER_CONFIG.BUTTON_SELECTOR,
        style: DIGILOCKER_CONFIG.BUTTON_STYLE,
        onSuccess: handleVerificationSuccess,
        onFailure: handleVerificationFailure,
      })
      /*
      const sdk = window.DigiboostSdk({
        gateway: 'production',
        token: verificationData.token,
        selector: DIGILOCKER_CONFIG.BUTTON_SELECTOR,
        style: DIGILOCKER_CONFIG.BUTTON_STYLE,
        onSuccess: handleVerificationSuccess,
        onFailure: handleVerificationFailure,
      })
      */
      console.log('SDK initialized successfully:')
    } catch (err) {
      console.error('Failed to start verification:', err)
      setError(
        'Failed to start verification: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
      )
    }
  }

  useEffect(() => {
    console.log('useEffect triggered - verificationData:', verificationData)
    if (verificationData && window.DigiboostSdk) {
      console.log('All conditions met, starting verification...')
      startVerification()
    }
  }, [verificationData])

  return {
    isLoading,
    verificationData,
    error,
    buttonRef,
    initializeVerification,
  }
}
