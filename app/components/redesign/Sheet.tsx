'use client'

import React, {useEffect} from 'react'
import {createPortal} from 'react-dom'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  /** Approximate max height. Used for both bottom sheet (mobile) and modal (md+). */
  maxHeight?: string
  /** Optional aria label for the panel. */
  label?: string
  /** Max width when rendered as a desktop modal. Default `md`. */
  desktopWidth?: 'md' | 'lg'
}

const DESKTOP_WIDTH: Record<NonNullable<SheetProps['desktopWidth']>, string> = {
  md: 'md:max-w-md',
  lg: 'md:max-w-lg',
}

/**
 * Bottom sheet on mobile; center modal on md+. Uses the same element so
 * focus/Escape/body-scroll-lock work identically across breakpoints.
 */
export default function Sheet({
  open,
  onClose,
  children,
  maxHeight = '85vh',
  label,
  desktopWidth = 'md',
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
      className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center md:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />
      <div
        className={[
          'relative bg-surface flex flex-col',
          // mobile: full-width bottom sheet, top corners rounded, slide up
          'rounded-t-sheet animate-slide-up',
          // desktop: floating modal, fully rounded, fade in
          `md:w-full ${DESKTOP_WIDTH[desktopWidth]} md:rounded-2xl md:animate-fade-in md:shadow-card-hover`,
        ].join(' ')}
        style={{maxHeight}}
      >
        <div className="md:hidden flex justify-center pt-2 pb-1 shrink-0">
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
