'use client'

import React, {useEffect, useRef, useState} from 'react'

const GSI_SRC = 'https://accounts.google.com/gsi/client'

let gsiPromise: Promise<void> | null = null
function loadGsi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.google?.accounts?.id) return Promise.resolve()
  if (gsiPromise) return gsiPromise

  gsiPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('GSI load failed')))
      return
    }
    const s = document.createElement('script')
    s.src = GSI_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('GSI load failed'))
    document.head.appendChild(s)
  })
  return gsiPromise
}

interface Props {
  onCredential: (credential: string) => void
  /** Pixel width for the rendered Google button. Defaults to container width. */
  width?: number
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
}

export default function GoogleSignInButton({
  onCredential,
  width,
  text = 'continue_with',
  shape = 'pill',
  theme = 'outline',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId) {
      setError('Google sign-in is not configured.')
      return
    }
    let cancelled = false

    loadGsi()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: response => {
            if (response?.credential) onCredential(response.credential)
          },
          ux_mode: 'popup',
          itp_support: true,
        })
        // Match container width when caller doesn't specify.
        const w = width ?? containerRef.current.clientWidth ?? 320
        containerRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme,
          size: 'large',
          text,
          shape,
          logo_alignment: 'center',
          width: Math.min(Math.max(Math.round(w), 200), 400),
        })
      })
      .catch(() => setError('Could not load Google sign-in.'))

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential, width, text, shape, theme])

  if (error) {
    return <div className="text-[12px] text-danger text-center">{error}</div>
  }
  return <div ref={containerRef} className="flex justify-center" />
}
