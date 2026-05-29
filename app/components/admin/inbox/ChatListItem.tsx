'use client'

import React from 'react'
import Link from 'next/link'
import {IInboxConversationRow} from '../../../../api/admin/whatsapp.api'

interface Props {
  row: IInboxConversationRow
  selected: boolean
}

// Format a timestamp for the list row: "now" / "5m" / "2h" / "Yesterday"
// / "12 May". Tight enough to never wrap on a 360px-wide list pane.
function formatTime(iso: string): string {
  const now = Date.now()
  const t = new Date(iso).getTime()
  const diffMs = now - t
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'now'
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const sameYear = new Date(t).getFullYear() === new Date(now).getFullYear()
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) {
    return new Date(t).toLocaleDateString(undefined, {weekday: 'short'})
  }
  return new Date(t).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : {year: 'numeric'}),
  })
}

function customerLabel(row: IInboxConversationRow): string {
  const c = row.customer
  if (!c) return `+91 ${row.phone}`
  const name = [c.firstname, c.lastname].filter(Boolean).join(' ').trim()
  if (name) return name
  return `+91 ${row.phone}`
}

function initial(row: IInboxConversationRow): string {
  const c = row.customer
  const candidate = c?.firstname ?? c?.lastname ?? row.phone
  return (candidate?.[0] ?? '?').toUpperCase()
}

export default function ChatListItem({row, selected}: Props) {
  const hasUnread = row.adminUnreadCount > 0
  return (
    <Link
      href={`/p/admin/customers/${row.id}`}
      className={`group block no-underline border-b border-line-soft transition-colors ${
        selected
          ? 'bg-surface-muted'
          : 'bg-surface hover:bg-surface-muted active:bg-surface-muted'
      }`}
    >
      <div className="flex items-start gap-3 px-3 py-3 relative">
        {selected && (
          <span
            aria-hidden
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-ink"
          />
        )}
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-surface-muted text-ink flex items-center justify-center text-[15px] font-extrabold border border-line">
            {initial(row)}
          </div>
          {row.windowOpen && (
            <span
              aria-hidden
              title="Within 24h response window"
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-bg"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 min-w-0 truncate text-[13.5px] leading-tight ${
                hasUnread ? 'font-extrabold text-ink' : 'font-bold text-ink'
              }`}
            >
              {customerLabel(row)}
            </div>
            <div className="shrink-0 font-mono text-[11px] text-ink-muted">
              {formatTime(row.lastMessageAt)}
            </div>
          </div>
          <div className="font-mono text-[11px] text-ink-muted mt-0.5">
            +91 {row.phone}
            {row.assignedAdmin && (
              <>
                {' · '}
                <span className="font-bold text-ink-secondary">
                  {row.assignedAdmin.name || `#${row.assignedAdmin.id}`}
                </span>
              </>
            )}
            {row.status !== 'OPEN' && (
              <>
                {' · '}
                <span className="uppercase tracking-kicker text-[10px] font-extrabold text-ink-muted">
                  {row.status}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`flex-1 min-w-0 truncate text-[12.5px] leading-snug ${
                hasUnread ? 'font-bold text-ink' : 'text-ink-secondary'
              }`}
            >
              {row.lastMessage ? (
                <>
                  {row.lastMessage.direction === 'outbound' && (
                    <span className="text-ink-muted">You: </span>
                  )}
                  {row.lastMessage.text || ' '}
                </>
              ) : (
                <span className="text-ink-muted italic">No messages yet</span>
              )}
            </div>
            {hasUnread && (
              <span
                aria-label={`${row.adminUnreadCount} unread`}
                className="shrink-0 min-w-[20px] h-5 rounded-full bg-accent text-ink text-[11px] font-extrabold font-mono flex items-center justify-center px-1.5"
              >
                {row.adminUnreadCount > 99 ? '99+' : row.adminUnreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
