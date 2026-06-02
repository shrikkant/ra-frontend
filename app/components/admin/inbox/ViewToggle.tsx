'use client'

import React from 'react'
import Link from 'next/link'

export type CustomersView = 'inbox' | 'customers'

interface Props {
  active: CustomersView
}

const TABS: Array<{key: CustomersView; label: string; href: string}> = [
  {key: 'inbox', label: 'Inbox', href: '/p/admin/customers'},
  {key: 'customers', label: 'All customers', href: '/p/admin/customers?view=customers'},
]

/**
 * Segmented control that switches the customers page between the WhatsApp
 * conversation inbox and the full customer directory. Rendered at the top of
 * the left pane so it sits above whichever list is active.
 */
export default function ViewToggle({active}: Props) {
  return (
    <div className="shrink-0 border-b border-line bg-bg px-3 py-2.5">
      <div className="flex gap-1 bg-surface-muted p-1 rounded-full">
        {TABS.map(tab => {
          const selected = tab.key === active
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={selected ? 'page' : undefined}
              className={`flex-1 text-center text-[12px] font-extrabold rounded-full px-3 py-1.5 no-underline transition-colors ${
                selected
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
