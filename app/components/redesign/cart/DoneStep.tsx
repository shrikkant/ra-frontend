'use client'

import React from 'react'
import Link from 'next/link'
import {CheckIcon} from '../icons'

interface DoneStepProps {
  orderId: number | string
}

export default function DoneStep({orderId}: DoneStepProps) {
  const display =
    typeof orderId === 'number'
      ? `RA-${String(orderId).padStart(8, '0').slice(-8)}`
      : orderId

  return (
    <div className="px-4 pt-10 pb-6 flex flex-col items-center text-center">
      <div
        aria-hidden
        className="w-[90px] h-[90px] rounded-full bg-accent flex items-center justify-center animate-pop"
      >
        <CheckIcon size={40} strokeWidth={3} className="text-ink" />
      </div>
      <h1 className="text-[26px] font-extrabold tracking-tight-lg text-ink mt-5">
        Order confirmed
      </h1>
      <p className="text-[14px] text-ink-secondary mt-1">
        We&apos;ll text you when it&apos;s on the way.
      </p>

      <div className="w-full max-w-xs mt-6 bg-surface rounded-[14px] border border-line-soft p-4 text-left">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          Order ID
        </div>
        <div className="font-mono text-[18px] font-extrabold text-ink mt-0.5">
          {display}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2.5 mt-6">
        <Link
          href={`/p/orders/${orderId}`}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 no-underline text-center"
        >
          View my orders
        </Link>
        <Link
          href="/"
          className="w-full bg-surface border border-line text-ink text-[14px] font-extrabold rounded-full py-3.5 no-underline text-center"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
