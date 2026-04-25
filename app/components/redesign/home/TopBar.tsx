'use client'

import React, {useEffect} from 'react'
import Link from 'next/link'
import {useDispatch, useSelector} from 'react-redux'
import {ChevronDownIcon, UserIcon} from '../icons'
import {
  getUserLocation,
  setUserLocation,
} from '../../../../app-store/session/session.slice'
import {detectLocation} from '../../../../api/location.api'

const FALLBACK_CITY = 'Pune'

export default function TopBar() {
  const dispatch = useDispatch()
  const stored = useSelector(getUserLocation)

  // Lazy-detect once and persist via redux-persist. We only fetch if
  // there's nothing stored — subsequent visits read from localStorage.
  useEffect(() => {
    if (stored) return
    let cancelled = false
    detectLocation().then(loc => {
      if (cancelled || !loc) return
      // Only persist if we got at least a city — empty payloads (VPN /
      // localhost) shouldn't overwrite the fallback display.
      if (loc.city) dispatch(setUserLocation(loc))
    })
    return () => {
      cancelled = true
    }
  }, [stored, dispatch])

  const city = stored?.city || FALLBACK_CITY
  const area = stored?.area || ''

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
            {area ? `${city}, ${area}` : city}
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
