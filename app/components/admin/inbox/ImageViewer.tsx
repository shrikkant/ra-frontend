'use client'

import React, {useEffect} from 'react'
import {createPortal} from 'react-dom'
import {CloseIcon} from '../../redesign/icons'

interface Props {
  src: string | null
  alt?: string
  onClose: () => void
  // When true the source is rendered in a full-screen PDF frame instead of
  // an <img>. Defaults to image so existing callers are unaffected.
  pdf?: boolean
}

// Full-screen image viewer. Mobile pinch-zoom is handled by the browser
// via `touch-action: pinch-zoom` on the image itself — building a custom
// gesture engine for marginal gain isn't worth the code surface here.
// ESC and backdrop tap close.
export default function ImageViewer({src, alt, onClose, pdf}: Props) {
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [src, onClose])

  if (!src) return null
  if (typeof document === 'undefined') return null

  const body = (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
      >
        <CloseIcon size={20} />
      </button>
      <a
        href={src}
        target="_blank"
        rel="noreferrer noopener"
        onClick={e => e.stopPropagation()}
        className="absolute top-3 left-3 z-10 text-white text-[12px] font-bold uppercase tracking-kicker bg-white/15 hover:bg-white/25 rounded-full px-3 py-2"
      >
        Open full
      </a>
      {pdf ? (
        <iframe
          src={src}
          title={alt ?? 'Document'}
          onClick={e => e.stopPropagation()}
          className="w-[92vw] h-[88vh] bg-white rounded-[8px]"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? 'Image'}
          // Admin-gated media endpoint — cookie auth required cross-origin.
          crossOrigin="use-credentials"
          onClick={e => e.stopPropagation()}
          className="max-w-full max-h-full object-contain"
          style={{touchAction: 'pinch-zoom'}}
        />
      )}
    </div>
  )

  return createPortal(body, document.body)
}
