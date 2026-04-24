'use client'

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useSelector} from 'react-redux'
import {HomeIcon, SearchIcon, CartIcon, UserIcon} from './icons'
import {getCart} from '../../../app-store/user/orders/orders.slice'

const TABS = [
  {href: '/', label: 'Home', Icon: HomeIcon, match: (p: string) => p === '/'},
  {
    href: '/pune/rent-camera?q=',
    label: 'Search',
    Icon: SearchIcon,
    match: (p: string) => p.startsWith('/pune/rent-') || p.startsWith('/s'),
  },
  {
    href: '/p/mycart',
    label: 'Cart',
    Icon: CartIcon,
    match: (p: string) => p.startsWith('/p/mycart'),
    badge: true,
  },
  {
    href: '/p/profile',
    label: 'Profile',
    Icon: UserIcon,
    match: (p: string) => p.startsWith('/p/profile') || p.startsWith('/join'),
  },
]

export default function TabBar() {
  const pathname = usePathname() || '/'
  const cart = useSelector(getCart)
  const cartCount = cart?.items?.length ?? 0

  return (
    <nav
      id="ra-tab-bar"
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none"
    >
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="pointer-events-auto flex items-center justify-between bg-ink text-surface rounded-full shadow-tab-bar px-4 py-3">
          {TABS.map(({href, label, Icon, match, badge}) => {
            const active = match(pathname)
            return (
              <Link
                key={label}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors ${
                  active
                    ? 'bg-accent text-ink'
                    : 'text-surface/70 hover:text-surface'
                }`}
                data-tab={label.toLowerCase()}
                {...(label === 'Cart' ? {'data-cart-target': 'mobile'} : {})}
              >
                <Icon size={22} />
                <span className="text-[10px] font-bold tracking-[1.2px] uppercase">
                  {label}
                </span>
                {badge && cartCount > 0 && !active && (
                  <span
                    aria-hidden
                    className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] rounded-full bg-accent text-ink text-[10px] font-bold font-mono flex items-center justify-center px-1"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
