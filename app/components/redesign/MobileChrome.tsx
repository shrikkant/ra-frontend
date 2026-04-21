import React from 'react'
import TabBar from './TabBar'

interface MobileChromeProps {
  children: React.ReactNode
  /** Hide the floating bottom tab bar (e.g., on auth/KYC flows). */
  hideTabBar?: boolean
  /** Override page background. Defaults to the warm off-white --bg. */
  background?: string
}

/**
 * Mobile-first page shell for redesigned screens. Provides the safe-area
 * top padding (54px notch clearance), capped reading width, and a floating
 * bottom tab bar. Screens slot their own top bar inside as the first child.
 */
export default function MobileChrome({
  children,
  hideTabBar = false,
  background = 'bg-bg',
}: MobileChromeProps) {
  return (
    <div className={`min-h-screen ${background} font-sans text-ink`}>
      <div className="mx-auto max-w-md pt-notch pb-[120px]">{children}</div>
      {!hideTabBar && <TabBar />}
    </div>
  )
}
