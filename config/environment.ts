// Environment configuration
export const ENV_CONFIG = {
  // API URLs

  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://alpha.rentacross.com/api/',
  API_V1_URL:
    process.env.NEXT_PUBLIC_API_V1_URL || 'http://localhost:8082/api/v1/',
  DIGILOCKER_API_URL:
    process.env.NEXT_PUBLIC_DIGILOCKER_API_URL ||
    'https://rentacross.com/api/v1',

  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://rentacross.com',
  BASE_URL_WWW:
    process.env.NEXT_PUBLIC_BASE_URL_WWW || 'https://www.rentacross.com',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  // Legacy support (for backward compatibility)
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_ENV: process.env.REACT_APP_ENV,
  REACT_APP_URL: process.env.REACT_APP_URL,
} as const

// Log environment configuration on initialization
if (typeof window !== 'undefined') {
  // Client-side logging
  console.log('🌍 Environment Configuration (Client):', {
    API_BASE_URL: ENV_CONFIG.API_BASE_URL,
    API_V1_URL: ENV_CONFIG.API_V1_URL,
    DIGILOCKER_API_URL: ENV_CONFIG.DIGILOCKER_API_URL,
    BASE_URL: ENV_CONFIG.BASE_URL,
    BASE_URL_WWW: ENV_CONFIG.BASE_URL_WWW,
    NODE_ENV: ENV_CONFIG.NODE_ENV,
    IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
    IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
  })
} else {
  // Server-side logging
  console.log('🌍 Environment Configuration (Server):', {
    API_BASE_URL: ENV_CONFIG.API_BASE_URL,
    API_V1_URL: ENV_CONFIG.API_V1_URL,
    DIGILOCKER_API_URL: ENV_CONFIG.DIGILOCKER_API_URL,
    BASE_URL: ENV_CONFIG.BASE_URL,
    BASE_URL_WWW: ENV_CONFIG.BASE_URL_WWW,
    NODE_ENV: ENV_CONFIG.NODE_ENV,
    IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
    IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
  })
}

// Helper function to get the appropriate API URL based on context
export const getApiUrl = (context: 'client' | 'server' = 'client') => {
  if (context === 'server') {
    return ENV_CONFIG.API_V1_URL
  }
  return ENV_CONFIG.API_BASE_URL
}

// Helper function to get the appropriate base URL
export const getBaseUrl = (includeWWW = false) => {
  return includeWWW ? ENV_CONFIG.BASE_URL_WWW : ENV_CONFIG.BASE_URL
}
