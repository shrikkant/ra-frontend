'use client'

import React from 'react'
import Link from 'next/link'
import {useSelector} from 'react-redux'
import {CartIcon, ChevronDownIcon} from './icons'
import {getCart} from '../../../app-store/user/orders/orders.slice'
import {useDetectedLocation} from './useDetectedLocation'
import DateChip from './DateChip'

/**
 * Mobile-only top header — sibling of DesktopNav inside MobileChrome.
 * Houses brand presence (the chrome was previously empty above the page
 * content on mobile) and the persistent rental-date context. The bottom
 * TabBar still owns primary navigation; this header owns search context.
 */
export default function MobileNav() {
  const cart = useSelector(getCart)
  const cartCount = cart?.items?.length ?? 0
  const {city} = useDetectedLocation()

  return (
    <nav
      aria-label="Search context"
      className="md:hidden sticky top-0 z-30 bg-bg/90 border-b border-line backdrop-blur pt-notch"
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <Link
          href="/"
          aria-label="RentAcross home"
          className="shrink-0 w-9 h-9 rounded-[10px] bg-ink text-surface flex items-center justify-center font-extrabold text-[14px] tracking-tight-lg no-underline"
        >
          <span className="text-accent">R</span>A
        </Link>

        <button
          type="button"
          className="shrink min-w-0 flex items-center gap-0.5 text-[12px] font-semibold text-ink"
        >
          <span className="truncate">{city}</span>
          <ChevronDownIcon size={12} />
        </button>

        <div className="flex-1 flex justify-center min-w-0">
          <DateChip variant="compact" />
        </div>

        <Link
          href="/p/mycart"
          aria-label={`Cart, ${cartCount} items`}
          data-cart-target="mobile-header"
          className="relative shrink-0 w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-ink no-underline"
        >
          <CartIcon size={18} />
          {cartCount > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-accent text-ink text-[10px] font-bold font-mono flex items-center justify-center px-1"
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
