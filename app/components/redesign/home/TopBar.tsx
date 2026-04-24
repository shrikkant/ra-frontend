import React from 'react'
import Link from 'next/link'
import {ChevronDownIcon, UserIcon} from '../icons'

interface TopBarProps {
  city?: string
  area?: string
}

export default function TopBar({city = 'Pune', area = 'Kothrud'}: TopBarProps) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-1.5 pb-1.5">
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden
          className="w-9 h-9 rounded-[10px] bg-ink text-surface flex items-center justify-center font-extrabold text-[16px] tracking-tight-lg"
        >
          <span className="text-accent">R</span>A
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-kicker font-semibold text-ink-muted">
            Deliver to
          </div>
          <button
            type="button"
            className="text-[14px] font-semibold text-ink flex items-center gap-1"
          >
            {city}, {area}
            <ChevronDownIcon size={12} />
          </button>
        </div>
      </div>
      <Link
        href="/p/profile"
        aria-label="Open profile"
        className="relative w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink"
      >
        <UserIcon size={20} />
        <span
          aria-hidden
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent border-2 border-surface"
        />
      </Link>
    </div>
  )
}
