import {useEffect, useState} from 'react'

// Add your reCAPTCHA site key to environment variables
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

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

export const useRecaptcha = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true)
      })
    } else {
      // Wait for script to load (handled by Scripts component)
      const checkRecaptcha = setInterval(() => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setIsReady(true)
            clearInterval(checkRecaptcha)
          })
        }
      }, 100)

      return () => clearInterval(checkRecaptcha)
    }
  }, [])

  /**
   * Execute reCAPTCHA and get a token
   * @param action - Action name for this token (e.g., 'add_to_cart', 'checkout')
   * @returns Promise<string> - reCAPTCHA token
   */
  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.error('reCAPTCHA site key is not configured')
      throw new Error('reCAPTCHA is not configured')
    }

    if (!isReady) {
      // Wait for reCAPTCHA to become ready, up to 8s. The script is
      // loaded with strategy="afterInteractive" (see app/layout.tsx), but
      // on slow connections it can still take 4-6s; the previous 2s
      // ceiling was firing before grecaptcha was defined and breaking
      // Add to Cart with a "missing recaptcha token" error.
      await new Promise<void>((resolve) => {
        const start = Date.now()
        const check = setInterval(() => {
          if (window.grecaptcha || Date.now() - start > 8000) {
            clearInterval(check)
            resolve()
          }
        }, 50)
      })
    }

    if (!window.grecaptcha) {
      // Still not loaded after the wait window — surface a real error
      // instead of crashing on `undefined.execute`. Callers (e.g.
      // useAddToCart) catch and degrade gracefully.
      throw new Error('reCAPTCHA failed to load')
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action,
      })
      return token
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error)
      throw error
    }
  }

  return {
    isReady,
    executeRecaptcha,
  }
}
