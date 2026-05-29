'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {ArrowLeftIcon, CheckIcon} from '../../redesign/icons'
import {
  IInboxConversationDetail,
  IInboxWindowStatus,
  assignInboxConversation,
  markInboxConversationRead,
  setInboxConversationStatus,
  ConversationStatus,
} from '../../../../api/admin/whatsapp.api'
import {VERIFICATION_FLAGS, isVerified} from '../../../../config/constants'

interface Props {
  detail: IInboxConversationDetail
  window: IInboxWindowStatus | null
  currentAdminId: number | null
  onChange: () => void
}

function initial(detail: IInboxConversationDetail): string {
  const c = detail.customer
  const candidate = c?.firstname ?? c?.lastname ?? detail.phone
  return (candidate?.[0] ?? '?').toUpperCase()
}

function customerLabel(detail: IInboxConversationDetail): string {
  const c = detail.customer
  if (!c) return `+91 ${detail.phone}`
  const name = [c.firstname, c.lastname].filter(Boolean).join(' ').trim()
  return name || `+91 ${detail.phone}`
}

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return 'Closed'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h >= 1) return `${h}h ${m}m left`
  return `${m}m left`
}

export default function CustomerHeader({
  detail,
  window: windowStatus,
  currentAdminId,
  onChange,
}: Props) {
  const [busy, setBusy] = useState(false)

  const kycVerified = detail.customer
    ? isVerified(detail.customer.verified, VERIFICATION_FLAGS.AADHAAR)
    : false
  const isMine =
    !!currentAdminId && detail.assignedAdmin?.id === currentAdminId

  const wrap = async (fn: () => Promise<unknown>) => {
    if (busy) return
    setBusy(true)
    try {
      await fn()
      onChange()
    } catch (e) {
      console.error('Conversation action failed', e)
    } finally {
      setBusy(false)
    }
  }

  const toggleMine = () =>
    wrap(() =>
      assignInboxConversation(detail.id, isMine ? null : 'me').then(() =>
        markInboxConversationRead(detail.id),
      ),
    )

  const changeStatus = (
    status: ConversationStatus,
    snoozedUntil?: string | null,
  ) =>
    wrap(() => setInboxConversationStatus(detail.id, status, snoozedUntil))

  return (
    <div className="shrink-0 border-b border-line bg-surface">
      <div className="flex items-center gap-3 px-3 lg:px-5 pt-3 lg:pt-4 pb-2">
        <Link
          href="/p/admin/customers"
          aria-label="Back to inbox"
          className="lg:hidden -ml-1 w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-surface-muted"
        >
          <ArrowLeftIcon size={18} />
        </Link>
        <div className="w-11 h-11 rounded-full bg-surface-muted border border-line text-ink flex items-center justify-center text-[15px] font-extrabold shrink-0">
          {initial(detail)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-extrabold text-ink truncate">
              {customerLabel(detail)}
            </div>
            {kycVerified && (
              <span className="inline-flex items-center gap-1 bg-success/15 text-success text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-kicker shrink-0">
                <CheckIcon size={9} strokeWidth={3} />
                KYC
              </span>
            )}
          </div>
          <div className="font-mono text-[12px] text-ink-muted truncate">
            +91 {detail.phone}
            {detail.customer?.signinSource === 'W' && (
              <> · WhatsApp signup</>
            )}
            {detail.customer?.city && <> · {detail.customer.city}</>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 lg:px-5 pb-3 overflow-x-auto scrollbar-hide">
        <WindowPill window={windowStatus} />
        <StatusPill
          status={detail.status}
          busy={busy}
          onSelect={changeStatus}
        />
        <AssignPill
          isMine={isMine}
          assignedName={detail.assignedAdmin?.name ?? null}
          busy={busy}
          onToggle={toggleMine}
        />
      </div>
    </div>
  )
}

function WindowPill({window: w}: {window: IInboxWindowStatus | null}) {
  if (!w) return null
  if (w.open) {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 bg-success/15 text-success text-[11px] font-extrabold uppercase tracking-kicker rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        {formatRemaining(w.secondsRemaining)}
      </span>
    )
  }
  return (
    <span
      title="Outside Meta's 24h window — only approved templates can be sent"
      className="shrink-0 inline-flex items-center gap-1 bg-accent/30 text-ink text-[11px] font-extrabold uppercase tracking-kicker rounded-full px-2.5 py-1"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      Templates only
    </span>
  )
}

// Quick-pick snooze durations. Each computes a concrete ISO timestamp at
// click-time so the backend gets an absolute moment, not a relative one.
const SNOOZE_OPTIONS: Array<{
  label: string
  compute: () => Date
}> = [
  {
    label: '1 hour',
    compute: () => new Date(Date.now() + 60 * 60 * 1000),
  },
  {
    label: '3 hours',
    compute: () => new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
  {
    label: 'Tomorrow 9am',
    compute: () => {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      d.setHours(9, 0, 0, 0)
      return d
    },
  },
  {
    label: 'Next Monday 9am',
    compute: () => {
      const d = new Date()
      const day = d.getDay() // 0=Sun
      const daysAhead = ((1 - day + 7) % 7) || 7
      d.setDate(d.getDate() + daysAhead)
      d.setHours(9, 0, 0, 0)
      return d
    },
  },
]

function StatusPill({
  status,
  busy,
  onSelect,
}: {
  status: ConversationStatus
  busy: boolean
  onSelect: (status: ConversationStatus, snoozedUntil?: string | null) => void
}) {
  // Two-step menu: first the status choice, then for SNOOZED a sub-menu
  // of duration presets. Keeps the StatusPill compact while still letting
  // the rep set a real auto-promote moment.
  const [open, setOpen] = useState(false)
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const others: ConversationStatus[] = (
    ['OPEN', 'RESOLVED', 'SNOOZED'] as ConversationStatus[]
  ).filter(s => s !== status)

  const close = () => {
    setOpen(false)
    setSnoozeOpen(false)
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setOpen(o => !o)
          setSnoozeOpen(false)
        }}
        disabled={busy}
        className="inline-flex items-center gap-1 bg-surface border border-line text-ink text-[11px] font-extrabold uppercase tracking-kicker rounded-full px-2.5 py-1 hover:bg-surface-muted disabled:opacity-60"
      >
        {status.toLowerCase()}
      </button>
      {open && !snoozeOpen && (
        <div className="absolute top-full mt-1 left-0 z-20 bg-surface border border-line rounded-[12px] shadow-lg overflow-hidden min-w-[180px]">
          {others.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (s === 'SNOOZED') {
                  setSnoozeOpen(true)
                  return
                }
                close()
                onSelect(s)
              }}
              className="flex items-center justify-between w-full text-left px-3 py-2 text-[12px] font-bold text-ink hover:bg-surface-muted"
            >
              <span>Mark as {s.toLowerCase()}</span>
              {s === 'SNOOZED' && (
                <span aria-hidden className="text-ink-muted">
                  ›
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {open && snoozeOpen && (
        <div className="absolute top-full mt-1 left-0 z-20 bg-surface border border-line rounded-[12px] shadow-lg overflow-hidden min-w-[180px]">
          <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
            Snooze for…
          </div>
          {SNOOZE_OPTIONS.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                close()
                onSelect('SNOOZED', opt.compute().toISOString())
              }}
              className="block w-full text-left px-3 py-2 text-[12px] font-bold text-ink hover:bg-surface-muted"
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              close()
              onSelect('SNOOZED', null)
            }}
            className="block w-full text-left px-3 py-2 text-[12px] font-bold text-ink-secondary hover:bg-surface-muted border-t border-line-soft"
          >
            Indefinitely
          </button>
        </div>
      )}
    </div>
  )
}

function AssignPill({
  isMine,
  assignedName,
  busy,
  onToggle,
}: {
  isMine: boolean
  assignedName: string | null
  busy: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-kicker rounded-full px-2.5 py-1 border transition-colors disabled:opacity-60 ${
        isMine
          ? 'bg-ink text-surface border-ink'
          : 'bg-surface text-ink-secondary border-line hover:text-ink'
      }`}
    >
      {isMine
        ? '✓ Assigned to me'
        : assignedName
          ? `Assigned: ${assignedName}`
          : 'Take this'}
    </button>
  )
}
