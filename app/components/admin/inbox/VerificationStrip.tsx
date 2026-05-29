'use client'

import React from 'react'
import {IUser} from '../../../../app-store/types'
import {IDocument} from '../../../../app-store/app-defaults/types'
import {CheckIcon} from '../../redesign/icons'
import {VERIFICATION_FLAGS, isVerified} from '../../../../config/constants'

interface Props {
  customer: IUser
  documents: IDocument[]
}

interface Row {
  id: string
  title: string
  subtitle: string
  done: boolean
}

/**
 * Compact verification status — three rows, pill on the right.
 *
 * Replaces the legacy white-card verification section. Same predicates
 * (KYC = Aadhaar flag, Email = flag or Google/Facebook OAuth, Documents
 * = utility bill + identity doc) — different visual treatment.
 */
export default function VerificationStrip({customer, documents}: Props) {
  const kyc = isVerified(customer.verified || 0, VERIFICATION_FLAGS.AADHAAR)
  const email =
    isVerified(customer.verified || 0, VERIFICATION_FLAGS.EMAIL) ||
    customer.signin_source === 'G' ||
    customer.signin_source === 'F'
  const hasUtility = documents.some(d => d.document_type === 'utility_bill')
  const hasIdentity = documents.some(
    d =>
      d.document_type === 'driving_license' ||
      d.document_type === 'passport',
  )
  const docs = hasUtility && hasIdentity

  const rows: Row[] = [
    {
      id: 'kyc',
      title: 'KYC',
      subtitle: kyc ? 'Aadhaar verified via DigiLocker' : 'DigiLocker pending',
      done: kyc,
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: email
        ? customer.signin_source === 'G'
          ? 'Google sign-in'
          : customer.signin_source === 'F'
            ? 'Facebook sign-in'
            : 'OTP verified'
        : 'Address not confirmed',
      done: email,
    },
    {
      id: 'docs',
      title: 'Documents',
      subtitle:
        hasUtility && hasIdentity
          ? 'Utility bill + identity proof on file'
          : !hasUtility && !hasIdentity
            ? 'No documents uploaded'
            : !hasUtility
              ? 'Missing utility bill'
              : 'Missing identity proof',
      done: docs,
    },
  ]

  return (
    <section className="bg-surface border border-line rounded-[16px] overflow-hidden">
      <div className="px-4 py-3 border-b border-line-soft">
        <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
          Verification
        </div>
        <div className="text-[15px] font-extrabold text-ink leading-tight mt-0.5">
          Current state
        </div>
      </div>
      <ul className="divide-y divide-line-soft">
        {rows.map(row => (
          <li
            key={row.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[14px] font-extrabold ${
                row.done
                  ? 'bg-success/15 text-success'
                  : 'bg-surface-muted text-ink-muted'
              }`}
              aria-hidden
            >
              {row.done ? <CheckIcon size={14} strokeWidth={3} /> : '·'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-extrabold text-ink leading-tight">
                {row.title}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5 truncate">
                {row.subtitle}
              </div>
            </div>
            <span
              className={`shrink-0 inline-flex items-center text-[10px] uppercase tracking-kicker font-extrabold rounded-full px-2 py-0.5 ${
                row.done
                  ? 'bg-success/15 text-success'
                  : 'bg-accent/30 text-ink'
              }`}
            >
              {row.done ? 'Verified' : 'Pending'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
