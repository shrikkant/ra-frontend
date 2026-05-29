'use client'

import React from 'react'
import {SearchIcon, CloseIcon} from '../../redesign/icons'
import {InboxFilters} from './hooks/useConversations'

interface Props {
  filters: InboxFilters
  onChange: (next: InboxFilters) => void
}

interface ChipDef {
  label: string
  match: (f: InboxFilters) => boolean
  apply: (f: InboxFilters) => InboxFilters
}

// Predefined filter combinations. Each chip toggles a single axis on the
// current filter object — they're not mutually exclusive (you can have
// "Mine" + "Open" at once), so chips highlight independently and the
// status / assignedTo axes round-trip in the URL via the parent screen.
const CHIPS: ChipDef[] = [
  {
    label: 'All',
    match: f => !f.status && !f.assignedTo,
    apply: () => ({}),
  },
  {
    label: 'Mine',
    match: f => f.assignedTo === 'me',
    apply: f => ({...f, assignedTo: f.assignedTo === 'me' ? undefined : 'me'}),
  },
  {
    label: 'Unassigned',
    match: f => f.assignedTo === 'unassigned',
    apply: f => ({
      ...f,
      assignedTo:
        f.assignedTo === 'unassigned' ? undefined : 'unassigned',
    }),
  },
  {
    label: 'Open',
    match: f => f.status === 'OPEN',
    apply: f => ({
      ...f,
      status: f.status === 'OPEN' ? undefined : 'OPEN',
    }),
  },
  {
    label: 'Resolved',
    match: f => f.status === 'RESOLVED',
    apply: f => ({
      ...f,
      status: f.status === 'RESOLVED' ? undefined : 'RESOLVED',
    }),
  },
]

export default function ChatFilters({filters, onChange}: Props) {
  return (
    <div className="shrink-0 border-b border-line bg-bg/95 backdrop-blur sticky top-0 z-10">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-surface border border-line rounded-full h-9 px-3">
          <SearchIcon size={14} className="text-ink-muted shrink-0" />
          <input
            type="search"
            value={filters.q ?? ''}
            onChange={e =>
              onChange({...filters, q: e.target.value || undefined})
            }
            placeholder="Search name or phone"
            aria-label="Search conversations"
            className="flex-1 min-w-0 bg-transparent text-[13px] text-ink placeholder:text-ink-muted outline-none"
          />
          {filters.q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onChange({...filters, q: undefined})}
              className="text-ink-muted shrink-0"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-hide">
        {CHIPS.map(chip => {
          const active = chip.match(filters)
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onChange(chip.apply(filters))}
              className={`shrink-0 text-[12px] font-extrabold rounded-full px-3 py-1.5 border transition-colors ${
                active
                  ? 'bg-ink text-surface border-ink'
                  : 'bg-surface text-ink-secondary border-line hover:text-ink'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
