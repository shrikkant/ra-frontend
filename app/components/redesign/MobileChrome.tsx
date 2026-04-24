import React from 'react'
import TabBar from './TabBar'
import DesktopNav from './DesktopNav'

type TopPad = 'notch' | 'none'
type BottomPad = 'tabBar' | 'cta' | 'none'

interface MobileChromeProps {
  children: React.ReactNode
  /** Hide the floating bottom tab bar (e.g., on auth/KYC flows). */
  hideTabBar?: boolean
  /**
   * Hide the desktop top nav as well. Auth/KYC screens that want a
   * focused, distraction-free layout can opt out.
   */
  hideDesktopNav?: boolean
  /** Top padding strategy. `notch` = 54px clear; `none` = flush. */
  topPad?: TopPad
  /** Bottom padding to clear floating UI. `tabBar` = 120px; `cta` = 96px. */
  bottomPad?: BottomPad
  /** Override page background. Defaults to the warm off-white --bg. */
  background?: string
  /**
   * Width strategy. `default` scales mobile→desktop (max-w-md → 7xl).
   * `narrow` keeps a card-style center layout at desktop (max-w-md).
   */
  width?: 'default' | 'narrow'
}

const TOP_CLASS: Record<TopPad, string> = {
  notch: 'pt-notch md:pt-6',
  none: '',
}

const BOTTOM_CLASS: Record<BottomPad, string> = {
  tabBar: 'pb-[120px] md:pb-12',
  cta: 'pb-24 md:pb-12',
  none: '',
}

const WIDTH_CLASS: Record<NonNullable<MobileChromeProps['width']>, string> = {
  default: 'max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl',
  narrow: 'max-w-md',
}

export default function MobileChrome({
  children,
  hideTabBar = false,
  hideDesktopNav = false,
  topPad = 'notch',
  bottomPad = 'tabBar',
  background = 'bg-bg',
  width = 'default',
}: MobileChromeProps) {
  return (
    <div className={`min-h-screen ${background} font-sans text-ink`}>
      {!hideDesktopNav && <DesktopNav />}
      <div
        className={`mx-auto px-0 md:px-6 ${WIDTH_CLASS[width]} ${TOP_CLASS[topPad]} ${BOTTOM_CLASS[bottomPad]}`}
      >
        {children}
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  )
}
