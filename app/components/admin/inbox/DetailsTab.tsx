'use client'

import React, {useEffect, useState} from 'react'
import {
  fetchActiveCustomer,
  getCustomerDocuments,
} from '../../../../api/admin/customers.api'
import {IUser} from '../../../../app-store/types'
import {IDocument} from '../../../../app-store/app-defaults/types'
import ProfileEditCard from './ProfileEditCard'
import VerificationStrip from './VerificationStrip'
import DocumentsGrid from './DocumentsGrid'

interface Props {
  userId: number | null
}

/**
 * Profile + verification + documents, redesigned for the chat right pane.
 *
 * Three inbox-native cards stacked: ProfileEditCard (tap-to-edit per
 * row), VerificationStrip (compact 3-row status), DocumentsGrid
 * (touch-friendly 2-up tile grid). All call into the same admin APIs
 * the legacy /p/admin/customers/[id] page uses — only the chrome and
 * interaction shape differ. Updates and uploads patch local state
 * optimistically, then the canonical row replaces it on the next fetch.
 */
export default function DetailsTab({userId}: Props) {
  const [customer, setCustomer] = useState<IUser | null>(null)
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([fetchActiveCustomer(userId), getCustomerDocuments(userId)])
      .then(([c, docs]) => {
        if (cancelled) return
        setCustomer(c)
        setDocuments(docs ?? [])
      })
      .catch(e => {
        if (cancelled) return
        setError(e?.message || 'Could not load details')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center bg-bg">
        <div className="max-w-sm">
          <div className="text-[13px] font-bold text-ink">
            No customer linked yet
          </div>
          <div className="text-[12px] text-ink-muted mt-1 leading-relaxed">
            Profile and documents attach to a linked customer. This
            conversation isn't linked — auto-signup runs on the first
            inbound; if it didn't, link the user from the legacy tools and
            this tab will populate.
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-bg p-3 lg:p-5 space-y-3">
        <div className="h-48 rounded-[16px] bg-surface-muted animate-pulse" />
        <div className="h-32 rounded-[16px] bg-surface-muted animate-pulse" />
        <div className="h-64 rounded-[16px] bg-surface-muted animate-pulse" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center bg-bg">
        <div className="text-[13px] text-ink-muted">
          {error || 'Customer not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bg p-3 lg:p-5 space-y-3">
      <ProfileEditCard customer={customer} onChange={setCustomer} />
      <VerificationStrip customer={customer} documents={documents} />
      <DocumentsGrid
        userId={customer.id}
        documents={documents}
        onChange={setDocuments}
      />
    </div>
  )
}
