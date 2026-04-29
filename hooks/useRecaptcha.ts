import {useCallback} from 'react'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
const SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (
        siteKey: string,
        options: {action: string},
      ) => Promise<string>
    }
  }
}

// Module-level singleton so concurrent callers (e.g. ProductTile +
// ProductRow on the same page) share one network request and one
// readiness wait.
let loaderPromise: Promise<void> | null = null

function loadRecaptcha(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA cannot load on the server'))
  }
  if (window.grecaptcha) {
    return new Promise(resolve => window.grecaptcha.ready(resolve))
  }
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve())
      } else {
        reject(new Error('reCAPTCHA script loaded but grecaptcha is undefined'))
      }
    }
    script.onerror = () => {
      loaderPromise = null
      reject(new Error('reCAPTCHA script failed to load'))
    }
    document.head.appendChild(script)
  })

  return loaderPromise
}

export const useRecaptcha = () => {
  const executeRecaptcha = useCallback(async (action: string): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.error('reCAPTCHA site key is not configured')
      throw new Error('reCAPTCHA is not configured')
    }

    await loadRecaptcha()

    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action})
  }, [])

  return {executeRecaptcha}
}
