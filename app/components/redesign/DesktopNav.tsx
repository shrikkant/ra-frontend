'use client'

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useSelector} from 'react-redux'
import {SearchIcon, CartIcon, UserIcon, ChevronDownIcon} from './icons'
import {getCart} from '../../../app-store/user/orders/orders.slice'
import {useDetectedLocation} from './useDetectedLocation'
import DateChip from './DateChip'

const NAV_LINKS = [
  {href: '/pune/rent-camera?q=', label: 'Cameras'},
  {href: '/pune/rent-lenses', label: 'Lenses'},
  {href: '/pune/rent-lights', label: 'Lights'},
  {href: '/blog', label: 'Blog'},
  {href: '/help', label: 'Help'},
]

/**
 * Sticky top nav rendered at md+ breakpoints in place of the floating
 * mobile TabBar. Logo, browse links, search shortcut, cart, user.
 * Cart icon carries the same data-cart-target attribute the
 * useAddToCart fly animation looks for.
 */
export default function DesktopNav() {
  const pathname = usePathname() ?? '/'
  const cart = useSelector(getCart)
  const cartCount = cart?.items?.length ?? 0
  const {city, area} = useDetectedLocation()

  return (
    <nav
      aria-label="Primary"
      className="hidden md:block sticky top-0 z-30 bg-bg/85 border-b border-line backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline text-ink"
          aria-label="RentAcross home"
        >
          <span
            aria-hidden
            className="w-9 h-9 rounded-[10px] bg-ink text-surface flex items-center justify-center font-extrabold text-[16px] tracking-tight-lg"
          >
            <span className="text-accent">R</span>A
          </span>
          <span className="text-[16px] font-extrabold tracking-tight-md hidden lg:inline">
            RentAcross
          </span>
        </Link>

        <button
          type="button"
          className="hidden lg:flex items-center gap-1 text-[13px] text-ink-secondary"
        >
          <span className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted mr-1">
            Deliver to
          </span>
          <span className="font-semibold text-ink">
            {area ? `${city}, ${area}` : city}
          </span>
          <ChevronDownIcon size={12} />
        </button>

        <div className="flex-1 flex items-center justify-center gap-5">
          {NAV_LINKS.map(link => {
            const active =
              pathname === link.href ||
              (link.href !== '/' &&
                pathname.startsWith(link.href.split('?')[0]))
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-bold no-underline transition-colors ${
                  active
                    ? 'text-ink'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <DateChip />

        <Link
          href="/pune/rent-camera?q="
          aria-label="Search"
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink"
        >
          <SearchIcon size={18} />
        </Link>
        <Link
          href="/p/mycart"
          aria-label={`Cart, ${cartCount} items`}
          data-cart-target="desktop"
          className="relative w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink"
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
        <Link
          href="/p/profile"
          aria-label="Profile"
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink"
        >
          <UserIcon size={18} />
        </Link>
      </div>
    </nav>
  )
}
