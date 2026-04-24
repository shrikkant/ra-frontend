/**
 * Single source of truth for backend URLs.
 *
 * Two audiences, two configs. Same endpoint, different routes.
 *
 *   SERVER_API_*  Next.js (build + SSR) → backend
 *                   build:   public URL set via Dockerfile.prod ENV
 *                   runtime: docker hostname via .env.prod env_file
 *
 *   CLIENT_API_*  Browser → backend
 *                   inlined at build via NEXT_PUBLIC_*
 *                   always a publicly reachable URL
 *
 * Local dev defaults assume the backend runs at localhost:8082.
 * Set NEXT_PUBLIC_CLIENT_API_URL + SERVER_API_URL in .env.local
 * to point at a remote backend (labs/alpha/staging).
 */

const SERVER_API_URL =
  process.env.SERVER_API_URL || 'http://localhost:8082/api/'
const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_CLIENT_API_URL || 'http://localhost:8082/api/'

export const ENV_CONFIG = {
  /** Server → backend (Next runtime + build). */
  SERVER_API_URL,
  SERVER_API_V1_URL:
    process.env.SERVER_API_V1_URL ||
    SERVER_API_URL.replace(/\/?$/, '/') + 'v1/',

  /** Browser → backend. */
  CLIENT_API_URL,
  CLIENT_API_V1_URL:
    process.env.NEXT_PUBLIC_CLIENT_API_V1_URL ||
    CLIENT_API_URL.replace(/\/?$/, '/') + 'v1/',

  /** Public site URLs (SEO, absolute links, Referer header). */
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  BASE_URL_WWW:
    process.env.NEXT_PUBLIC_BASE_URL_WWW ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:3000',
} as const

/**
 * Bare host root derived from CLIENT_API_URL — for endpoints that sit at
 * the host root rather than under /api/ (auth/local, auth/signup, auth/google).
 */
export const getClientHostBase = (): string =>
  ENV_CONFIG.CLIENT_API_URL.replace(/\/api\/?$/, '/') || '/'
