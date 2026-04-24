// Local-dev API fallback. In production we default to the relative
// `/api/` path (Nginx proxies it to the backend on the same origin).
// In development there's no proxy, so we point straight at labs by
// default. Override either by setting NEXT_PUBLIC_CLIENT_API_BASE_URL.
const __isDev = process.env.NODE_ENV === 'development'
const __devApiBase =
  process.env.NEXT_PUBLIC_DEV_API_BASE ?? 'https://labs.rentacross.com/api/'
const __devApiV1 =
  process.env.NEXT_PUBLIC_DEV_API_V1 ?? 'https://labs.rentacross.com/api/v1/'

// Environment configuration with clear client/server distinction
export const ENV_CONFIG = {
  // CLIENT-SIDE API URLs (Browser → External Node.js Server via same domain)
  // These are used when the browser makes API calls to the same domain
  // The domain proxy forwards /api/* requests to the Node.js server
  CLIENT_API_BASE_URL:
    process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL ||
    (__isDev ? __devApiBase : '/api/'),
  CLIENT_API_V1_URL:
    process.env.NEXT_PUBLIC_CLIENT_API_V1_URL ||
    (__isDev ? __devApiV1 : '/api/v1/'),

  // SERVER-SIDE API URLs (Next.js Server → External Node.js Server directly)
  // These are used when Next.js server makes direct API calls to external services
  // Can use internal network addresses for better performance
  SERVER_API_BASE_URL:
    process.env.SERVER_API_BASE_URL || 'http://localhost:8082/api/',
  SERVER_API_V1_URL:
    process.env.SERVER_API_V1_URL || 'http://localhost:8082/api/v1/',
  SERVER_DIGILOCKER_API_URL:
    process.env.SERVER_DIGILOCKER_API_URL || 'http://localhost:8082/api/v1/',

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
  // console.log('🌍 Environment Configuration (Client):', {
  //   CLIENT_API_BASE_URL: ENV_CONFIG.CLIENT_API_BASE_URL,
  //   CLIENT_API_V1_URL: ENV_CONFIG.CLIENT_API_V1_URL,
  //   BASE_URL: ENV_CONFIG.BASE_URL,
  //   BASE_URL_WWW: ENV_CONFIG.BASE_URL_WWW,
  //   NODE_ENV: ENV_CONFIG.NODE_ENV,
  //   IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
  //   IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
  // })
} else {
  // Server-side logging
  console.log('🌍 Environment Configuration (Server):', {
    CLIENT_API_BASE_URL: ENV_CONFIG.CLIENT_API_BASE_URL,
    CLIENT_API_V1_URL: ENV_CONFIG.CLIENT_API_V1_URL,
    SERVER_API_BASE_URL: ENV_CONFIG.SERVER_API_BASE_URL,
    SERVER_API_V1_URL: ENV_CONFIG.SERVER_API_V1_URL,
    SERVER_DIGILOCKER_API_URL: ENV_CONFIG.SERVER_DIGILOCKER_API_URL,
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
    return ENV_CONFIG.SERVER_API_V1_URL
  }
  return ENV_CONFIG.CLIENT_API_BASE_URL
}

// Helper function to get client-side API URL (Browser → External Node.js Server via same domain)
export const getClientApiUrl = (version: 'v1' | 'base' = 'base') => {
  return version === 'v1'
    ? ENV_CONFIG.CLIENT_API_V1_URL
    : ENV_CONFIG.CLIENT_API_BASE_URL
}

/**
 * Bare host root derived from CLIENT_API_BASE_URL — for endpoints that
 * sit at the host root rather than under /api/ (auth/local, auth/signup,
 * auth/google).
 *
 * Examples:
 *   `/api/`                              → `/`
 *   `https://labs.rentacross.com/api/`   → `https://labs.rentacross.com/`
 */
export const getClientHostBase = (): string => {
  const apiBase = ENV_CONFIG.CLIENT_API_BASE_URL
  // Strip trailing /api/ (or /api) from the API base.
  const stripped = apiBase.replace(/\/api\/?$/, '/')
  return stripped || '/'
}

// Helper function to get server-side API URL (Next.js → External Node.js Server directly)
export const getServerApiUrl = (version: 'v1' | 'base' = 'base') => {
  return version === 'v1'
    ? ENV_CONFIG.SERVER_API_V1_URL
    : ENV_CONFIG.SERVER_API_BASE_URL
}

// Helper function to get the appropriate base URL
export const getBaseUrl = (includeWWW = false) => {
  return includeWWW ? ENV_CONFIG.BASE_URL_WWW : ENV_CONFIG.BASE_URL
}

// Backward compatibility aliases
export const API_BASE_URL = ENV_CONFIG.CLIENT_API_BASE_URL
export const API_V1_URL = ENV_CONFIG.CLIENT_API_V1_URL
export const DIGILOCKER_API_URL = ENV_CONFIG.SERVER_DIGILOCKER_API_URL
