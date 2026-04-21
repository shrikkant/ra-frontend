'use client'

import React, {useEffect} from 'react'
import {createPortal} from 'react-dom'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  /** Approximate height (CSS value). Defaults to auto with max-height 85vh. */
  maxHeight?: string
  /** Optional aria label for the sheet panel. */
  label?: string
}

export default function Sheet({
  open,
  onClose,
  children,
  maxHeight = '85vh',
  label,
}: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex flex-col justify-end"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />
      <div
        className="relative bg-surface rounded-t-sheet animate-slide-up flex flex-col"
        style={{maxHeight}}
      >
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <span
            aria-hidden
            className="block w-9 h-1 rounded-full bg-ink-subtle"
          />
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
