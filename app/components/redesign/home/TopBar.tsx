'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {ChevronDownIcon, UserIcon} from '../icons'
import {useDetectedLocation} from '../useDetectedLocation'
import DeliverToModal from '../DeliverToModal'

export default function TopBar() {
  const {city, area} = useDetectedLocation()
  const [locationOpen, setLocationOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-1.5 pb-1.5">
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden
          className="w-9 h-9 rounded-[10px] bg-ink text-surface flex items-center justify-center font-extrabold text-[16px] tracking-tight-lg"
        >
          <span className="text-accent">R</span>A
        </div>
        <button
          type="button"
          onClick={() => setLocationOpen(true)}
          aria-label="Change delivery location"
          className="text-left -m-1 p-1 rounded-md active:bg-surface-muted"
        >
          <div className="text-[10px] uppercase tracking-kicker font-semibold text-ink-muted">
            Deliver to
          </div>
          <div className="text-[14px] font-semibold text-ink flex items-center gap-1">
            {area ? `${city}, ${area}` : city}
            <ChevronDownIcon size={12} />
          </div>
        </button>
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
      <DeliverToModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        currentCity={city}
      />
    </div>
  )
}
