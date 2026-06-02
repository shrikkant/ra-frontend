'use client'

import React from 'react'
import CustomerDirectory from './CustomerDirectory'
import CustomerProfile from './CustomerProfile'

interface Props {
  selectedUserId: number | null
  topSlot?: React.ReactNode
}

/**
 * Two-pane "All customers" view: directory list on the left, customer
 * profile on the right. Mirrors the inbox layout — single-pane navigation
 * on mobile (the list hides once a customer is selected), two-pane on
 * desktop. Selection is driven by the `uid` query param.
 */
export default function CustomerDirectoryScreen({
  selectedUserId,
  topSlot,
}: Props) {
  return (
    <div className="flex bg-bg text-ink" style={{height: 'calc(100vh - 64px)'}}>
      <aside
        className={`${
          selectedUserId ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-[360px] xl:w-[400px] shrink-0 flex-col border-r border-line`}
      >
        {topSlot}
        <CustomerDirectory selectedUserId={selectedUserId} />
      </aside>

      <main
        className={`${
          selectedUserId ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col min-w-0`}
      >
        {selectedUserId ? (
          <CustomerProfile userId={selectedUserId} />
        ) : (
          <EmptyPane />
        )}
      </main>
    </div>
  )
}

function EmptyPane() {
  return (
    <div className="h-full flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <div className="w-14 h-14 rounded-full bg-surface border border-line mx-auto mb-4 flex items-center justify-center text-[24px]">
          👤
        </div>
        <div className="text-[15px] font-extrabold text-ink mb-1">
          Pick a customer
        </div>
        <div className="text-[12px] text-ink-muted leading-relaxed">
          Every customer shows here — including those who signed up with email
          and never messaged on WhatsApp. Select one to see their profile, KYC
          and orders.
        </div>
      </div>
    </div>
  )
}
