'use client'

import React from 'react'
import Link from 'next/link'
import {ICustomerDirectoryRow} from '../../../../api/admin/customers.api'
import {VERIFICATION_FLAGS, isVerified} from '../../../../config/constants'

interface Props {
  row: ICustomerDirectoryRow
  selected: boolean
}

function displayName(row: ICustomerDirectoryRow): string {
  const name = [row.firstname, row.lastname].filter(Boolean).join(' ').trim()
  if (name) return name
  // Fall back to the email's local part so email-only customers still read
  // as a person rather than a blank row.
  return row.email_address?.split('@')[0] || 'Unknown'
}

function initial(row: ICustomerDirectoryRow): string {
  const candidate = row.firstname || row.lastname || row.email_address || '?'
  return candidate[0].toUpperCase()
}

export default function CustomerListItem({row, selected}: Props) {
  const kycVerified = isVerified(row.verified, VERIFICATION_FLAGS.AADHAAR)

  return (
    <Link
      href={`/p/admin/customers?view=customers&uid=${row.id}`}
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
        <div className="w-11 h-11 rounded-full bg-surface-muted text-ink flex items-center justify-center text-[15px] font-extrabold border border-line shrink-0">
          {initial(row)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 truncate text-[13.5px] leading-tight font-bold text-ink">
              {displayName(row)}
            </div>
            {kycVerified && (
              <span className="shrink-0 inline-flex items-center bg-success/15 text-success text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-kicker">
                KYC
              </span>
            )}
          </div>
          <div className="truncate text-[12px] text-ink-secondary mt-0.5">
            {row.email_address || '—'}
          </div>
          <div className="font-mono text-[11px] text-ink-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
            {row.phone ? (
              <span>+91 {row.phone}</span>
            ) : (
              <span className="italic text-ink-muted">No phone</span>
            )}
            {row.city && (
              <>
                <span>·</span>
                <span>{row.city}</span>
              </>
            )}
            {row.conversationId && (
              <span
                title="Has a WhatsApp conversation"
                className="text-success"
              >
                · 💬
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
