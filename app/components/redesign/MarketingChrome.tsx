'use client'

import React from 'react'
import {useRouter} from 'next/navigation'
import MobileChrome from './MobileChrome'
import {ArrowLeftIcon} from './icons'

interface MarketingChromeProps {
  /** Short page title shown in the top bar. */
  title: string
  /** Page contents — the body below the header. */
  children: React.ReactNode
  /** Override default back behavior (defaults to router.back()). */
  onBack?: () => void
}

/**
 * Page shell for redesigned marketing/legal pages.
 * Adds a back-arrow + title bar at the top of MobileChrome.
 */
export default function MarketingChrome({
  title,
  children,
  onBack,
}: MarketingChromeProps) {
  const router = useRouter()
  return (
    <MobileChrome bottomPad="tabBar">
      {/* Mobile-only: back-arrow + title bar. Desktop nav already provides nav. */}
      <div className="md:hidden px-4 pt-1.5 pb-2 flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack ?? (() => router.back())}
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink shrink-0"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <div className="text-[16px] font-extrabold text-ink leading-tight truncate">
          {title}
        </div>
      </div>
      {children}
    </MobileChrome>
  )
}
