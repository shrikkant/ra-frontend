import React from 'react'
import TabBar from './TabBar'

type TopPad = 'notch' | 'none'
type BottomPad = 'tabBar' | 'cta' | 'none'

interface MobileChromeProps {
  children: React.ReactNode
  /** Hide the floating bottom tab bar (e.g., on auth/KYC flows). */
  hideTabBar?: boolean
  /** Top padding strategy. `notch` = 54px clear; `none` = flush. */
  topPad?: TopPad
  /** Bottom padding to clear floating UI. `tabBar` = 120px; `cta` = 96px. */
  bottomPad?: BottomPad
  /** Override page background. Defaults to the warm off-white --bg. */
  background?: string
}

const TOP_CLASS: Record<TopPad, string> = {
  notch: 'pt-notch',
  none: '',
}

const BOTTOM_CLASS: Record<BottomPad, string> = {
  tabBar: 'pb-[120px]',
  cta: 'pb-24',
  none: '',
}

/**
 * Mobile-first page shell for redesigned screens. Provides safe-area top
 * padding (54px notch by default), capped reading width, and a floating
 * bottom tab bar. Screens with their own floating chrome (product detail,
 * KYC) can opt out via `topPad="none"` and choose `bottomPad="cta"`.
 */
export default function MobileChrome({
  children,
  hideTabBar = false,
  topPad = 'notch',
  bottomPad = 'tabBar',
  background = 'bg-bg',
}: MobileChromeProps) {
  return (
    <div className={`min-h-screen ${background} font-sans text-ink`}>
      <div
        className={`mx-auto max-w-md ${TOP_CLASS[topPad]} ${BOTTOM_CLASS[bottomPad]}`}
      >
        {children}
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  )
}
