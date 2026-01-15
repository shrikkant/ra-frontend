import {useState, useRef, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser} from '../app-store/auth/auth.slice'
import {digiLockerAPI, VerificationData} from '../api/digilocker.api'
import {DIGILOCKER_CONFIG} from '../config/digilocker.config'
import {getAuthUser} from '../api/auth.api'
import {getToken} from '../api/axios.config'
import {ENV_CONFIG} from '../config/environment'
import {RootState} from '../app-store/store'

// Declare the global DigiboostWebSDK type
declare global {
  interface Window {
    DigiboostSdk: any
  }
}

type VerificationStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXPIRED'

interface StatusUpdate {
  status: VerificationStatus
  completed: boolean
  message: string
  clientId?: string
  completedAt?: string
}

export const useDigiLockerVerification = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const [isLoading, setIsLoading] = useState(false)
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>('PENDING')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isTracking, setIsTracking] = useState(false) // True after first poll/SSE confirms backend is tracking
  const buttonRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // SSE connection for real-time status updates
  const startStatusTracking = async () => {
    if (!currentUser?.id) {
      console.error('No user ID available for status tracking')
      return
    }

    // Update status message to show we're connecting
    setStatusMessage('Connecting to verification service...')

    try {
      // Note: EventSource doesn't support custom headers, so auth must be handled via cookies
      const sseUrl = `${ENV_CONFIG.CLIENT_API_V1_URL}digilocker/status-stream/${currentUser.id}`

      console.log('Starting SSE connection to:', sseUrl)

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      // Create new EventSource with auth header workaround
      // Note: EventSource doesn't support headers directly, so backend should handle auth via cookie/query param
      eventSourceRef.current = new EventSource(sseUrl)

      // Handle status updates from SSE
      const handleSSEStatusUpdate = async (data: StatusUpdate) => {
        console.log('Processing status update:', data)

        setVerificationStatus(data.status)
        setStatusMessage(data.message)

        if (data.completed) {
          // Close the connection
          eventSourceRef.current?.close()
          eventSourceRef.current = null

          if (data.status === 'COMPLETED') {
            console.log('Verification completed successfully!')
            // Fetch updated user data
            try {
              const freshUser = await getAuthUser()
              dispatch(authUser(freshUser))
            } catch (error) {
              console.error('Failed to fetch updated user:', error)
              setError('Verification completed but failed to update profile')
            }
          } else if (data.status === 'FAILED') {
            setError(data.message || 'Verification failed. Please try again.')
          } else if (data.status === 'EXPIRED') {
            setError('Verification expired. Please try again.')
          }
        }
      }

      // Default message handler - backend sends data: {json}\n\n format
      eventSourceRef.current.onmessage = async event => {
        console.log('SSE message received:', event.data)

        try {
          const data = JSON.parse(event.data)

          // Handle initial connection message
          if (data.connected) {
            console.log('SSE connected successfully')
            setStatusMessage(
              'Connected to verification service. Waiting for verification...',
            )
            return
          }

          // Handle status updates
          if (data.status) {
            setIsTracking(true) // Backend is now tracking
            await handleSSEStatusUpdate(data as StatusUpdate)
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error)
        }
      }

      eventSourceRef.current.onerror = error => {
        console.error('SSE connection error:', error)
        console.log('SSE readyState:', eventSourceRef.current?.readyState)
        // readyState: 0=CONNECTING, 1=OPEN, 2=CLOSED
        console.log('SSE connection failed, falling back to polling...')
        setStatusMessage('Connection interrupted. Checking status...')
        eventSourceRef.current?.close()
        eventSourceRef.current = null
        // Fall back to polling (which uses JWT header)
        startPolling()
      }

      eventSourceRef.current.onopen = () => {
        console.log('SSE connection opened successfully')
      }
    } catch (error) {
      console.error('Failed to start SSE:', error)
      // Fall back to polling
      startPolling()
    }
  }

  // Fallback polling mechanism
  const startPolling = async () => {
    if (!currentUser?.id) return

    console.log('Starting fallback polling...')
    let errorCount = 0
    const MAX_ERRORS = 5 // Stop polling after 5 consecutive errors

    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    // Single function to check status
    const checkStatus = async (): Promise<boolean> => {
      try {
        const token = await getToken()
        const response = await fetch(
          `${ENV_CONFIG.CLIENT_API_V1_URL}digilocker/verification-status/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'No body')
          console.error(`Status check failed: ${response.status}`, errorText)
          throw new Error(`Failed to fetch status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Polling status update:', data)

        setIsTracking(true) // Backend is now tracking
        setVerificationStatus(data.status)
        setStatusMessage(data.message || 'Checking verification status...')

        if (data.completed) {
          // Stop polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }

          if (data.status === 'COMPLETED') {
            // Fetch updated user data
            try {
              const freshUser = await getAuthUser()
              dispatch(authUser(freshUser))
            } catch (err) {
              console.error('Failed to fetch updated user:', err)
              setError('Verification completed but failed to update profile')
            }
          } else if (data.status === 'FAILED') {
            setError(data.message || 'Verification failed. Please try again.')
          } else if (data.status === 'EXPIRED') {
            setError('Verification expired. Please try again.')
          }
          return true // Completed, stop polling
        }

        // Reset error count on success
        errorCount = 0
        return false // Not completed, continue polling
      } catch (err) {
        errorCount++
        console.error('Polling error:', err, `(attempt ${errorCount}/${MAX_ERRORS})`)

        // Stop polling after too many consecutive errors
        if (errorCount >= MAX_ERRORS) {
          console.log('Stopping polling due to repeated errors')
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          setError('Unable to check verification status. Please refresh the page.')
          return true // Stop polling
        }
        return false // Continue polling
      }
    }

    // Check immediately first
    const completed = await checkStatus()
    if (completed) return

    // Then continue polling every 3 seconds
    pollIntervalRef.current = setInterval(async () => {
      await checkStatus()
    }, 3000) // Poll every 3 seconds (was 5)
  }

  const handleVerificationSuccess = async (data: any) => {
    console.log('DigiLocker onSuccess callback (deprecated):', data)
    // We no longer rely on this callback
    // Status tracking is handled by SSE/polling
  }

  const handleVerificationFailure = (_error: any) => {
    setStatusMessage('Checking status...')
    // console.error('DigiLocker onFailure callback:', error)
    // Still keep this for immediate UI feedback
    // setError('Verification process interrupted. Checking status...')
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

      // Set status to IN_PROGRESS immediately when verification starts
      setVerificationStatus('IN_PROGRESS')
      setStatusMessage('Initializing DigiLocker verification...')

      window.DigiboostSdk({
        gateway: DIGILOCKER_CONFIG.GATEWAY,
        token: verificationData.token,
        selector: DIGILOCKER_CONFIG.BUTTON_SELECTOR,
        style: DIGILOCKER_CONFIG.BUTTON_STYLE,
        onSuccess: handleVerificationSuccess,
        onFailure: handleVerificationFailure,
        webhookUrl: 'https://rentacross.com/api/v1/digilocker/webhook',
        webhook_url: 'https://rentacross.com/api/v1/digilocker/webhook',
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
      // Start status tracking when verification begins
      startStatusTracking()
    }
  }, [verificationData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Close SSE connection
      if (eventSourceRef.current) {
        console.log('Closing SSE connection on unmount')
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      // Clear polling interval
      if (pollIntervalRef.current) {
        console.log('Clearing polling interval on unmount')
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [])

  return {
    isLoading,
    verificationData,
    error,
    buttonRef,
    initializeVerification,
    verificationStatus,
    statusMessage,
    isTracking,
  }
}
