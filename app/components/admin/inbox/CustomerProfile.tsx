'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {
  fetchActiveCustomer,
  getCustomerDocuments,
} from '../../../../api/admin/customers.api'
import {fetchWhatsAppConversation} from '../../../../api/admin/whatsapp.api'
import {IUser} from '../../../../app-store/types'
import {IDocument} from '../../../../app-store/app-defaults/types'
import {ArrowLeftIcon} from '../../redesign/icons'
import ProfileEditCard from './ProfileEditCard'
import VerificationStrip from './VerificationStrip'
import DocumentsGrid from './DocumentsGrid'
import CustomerOrders from './CustomerOrders'

interface Props {
  userId: number
}

/**
 * Right-pane customer profile for the "All customers" view, keyed by user id
 * (works for everyone, including email-only customers with no conversation).
 *
 * Reuses the same cards the conversation inbox's Details tab uses
 * (ProfileEditCard / VerificationStrip / DocumentsGrid) plus a rental
 * history, in a single scroll region. When the customer has a WhatsApp
 * conversation, a "Open chat" CTA jumps into the inbox thread.
 */
export default function CustomerProfile({userId}: Props) {
  const [customer, setCustomer] = useState<IUser | null>(null)
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setChatId(null)

    Promise.all([fetchActiveCustomer(userId), getCustomerDocuments(userId)])
      .then(([c, docs]) => {
        if (cancelled) return
        setCustomer(c)
        setDocuments(docs ?? [])
      })
      .catch(e => {
        if (cancelled) return
        setError(e?.message || 'Could not load customer')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  // Resolve the customer's WhatsApp conversation (if any) for the chat CTA.
  // Best-effort and non-blocking — the profile renders regardless.
  useEffect(() => {
    let cancelled = false
    const phone = customer?.phone
    if (!phone) {
      setChatId(null)
      return
    }
    fetchWhatsAppConversation(phone)
      .then(conv => {
        if (cancelled) return
        const id = (conv as {id?: string})?.id
        setChatId(id ?? null)
      })
      .catch(() => {
        if (!cancelled) setChatId(null)
      })
    return () => {
      cancelled = true
    }
  }, [customer?.phone])

  return (
    <div className="flex-1 min-h-0 flex flex-col min-w-0 bg-bg">
      {/* Top bar: mobile back + chat CTA */}
      <div className="shrink-0 border-b border-line bg-surface flex items-center gap-2 px-3 lg:px-5 py-2.5">
        <Link
          href="/p/admin/customers?view=customers"
          aria-label="Back to customers"
          className="lg:hidden -ml-1 w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-surface-muted"
        >
          <ArrowLeftIcon size={18} />
        </Link>
        <span className="text-[12px] uppercase tracking-kicker font-extrabold text-ink-secondary flex-1">
          Customer profile
        </span>
        {chatId ? (
          <Link
            href={`/p/admin/customers/${chatId}`}
            className="shrink-0 inline-flex items-center gap-1.5 bg-ink text-surface text-[12px] font-extrabold rounded-full px-3 py-1.5 no-underline hover:opacity-90"
          >
            💬 Open chat
          </Link>
        ) : (
          <span className="shrink-0 text-[11px] text-ink-muted italic">
            No WhatsApp chat
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 lg:p-5 space-y-3">
          <div className="h-48 rounded-[16px] bg-surface-muted animate-pulse" />
          <div className="h-32 rounded-[16px] bg-surface-muted animate-pulse" />
          <div className="h-64 rounded-[16px] bg-surface-muted animate-pulse" />
        </div>
      ) : error || !customer ? (
        <div className="flex-1 min-h-0 flex items-center justify-center px-6 text-center">
          <div className="text-[13px] text-ink-muted">
            {error || 'Customer not found.'}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 lg:p-5 space-y-3">
          <ProfileEditCard customer={customer} onChange={setCustomer} />
          <VerificationStrip customer={customer} documents={documents} />
          <DocumentsGrid
            userId={customer.id}
            documents={documents}
            onChange={setDocuments}
          />
          <CustomerOrders userId={customer.id} />
        </div>
      )}
    </div>
  )
}
