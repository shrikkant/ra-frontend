'use client'

import {useEffect} from 'react'
import {ENV_CONFIG} from '../../config/environment'

export default function EnvironmentLogger() {
  useEffect(() => {
    // Log environment configuration on client-side mount
    console.group('🌍 Environment Configuration (Client-Side)')
    console.log('CLIENT_API_BASE_URL:', ENV_CONFIG.CLIENT_API_BASE_URL)
    console.log('CLIENT_API_V1_URL:', ENV_CONFIG.CLIENT_API_V1_URL)
    console.log('BASE_URL:', ENV_CONFIG.BASE_URL)
    console.log('BASE_URL_WWW:', ENV_CONFIG.BASE_URL_WWW)
    console.log('NODE_ENV:', ENV_CONFIG.NODE_ENV)
    console.log('IS_DEVELOPMENT:', ENV_CONFIG.IS_DEVELOPMENT)
    console.log('IS_PRODUCTION:', ENV_CONFIG.IS_PRODUCTION)
    console.groupEnd()

    // Also log raw environment variables for debugging
    console.group('🔧 Raw Environment Variables')
    console.log(
      'NEXT_PUBLIC_CLIENT_API_BASE_URL:',
      process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL,
    )
    console.log(
      'NEXT_PUBLIC_CLIENT_API_V1_URL:',
      process.env.NEXT_PUBLIC_CLIENT_API_V1_URL,
    )
    console.log('SERVER_API_BASE_URL:', process.env.SERVER_API_BASE_URL)
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
    console.log(
      'NEXT_PUBLIC_BASE_URL_WWW:',
      process.env.NEXT_PUBLIC_BASE_URL_WWW,
    )
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.groupEnd()
  }, [])

  // This component doesn't render anything
  return null
}
