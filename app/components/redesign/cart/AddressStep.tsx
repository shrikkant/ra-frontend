'use client'

import React, {useEffect, useState} from 'react'
import {ILocation} from '../../../../app-store/types'
import {HomeIcon, PlusIcon, ShieldIcon} from '../icons'
import AddressInlineForm from './AddressInlineForm'

export type FulfillmentMode = 'delivery' | 'pickup'

interface AddressStepProps {
  addresses: ILocation[]
  loading: boolean
  selectedId: number | null
  onSelect: (id: number) => void
  onContinue: () => void
  onAddressAdded: (address: ILocation) => void
  mode: FulfillmentMode
  onModeChange: (m: FulfillmentMode) => void
  deliveryFee: number
}

export default function AddressStep({
  addresses,
  loading,
  selectedId,
  onSelect,
  onContinue,
  onAddressAdded,
  mode,
  onModeChange,
  deliveryFee,
}: AddressStepProps) {
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (mode === 'delivery' && !loading && addresses.length === 0) {
      setAdding(true)
    }
    if (mode === 'pickup') {
      setAdding(false)
    }
  }, [loading, addresses.length, mode])

  const handleSaved = (address: ILocation) => {
    onAddressAdded(address)
    setAdding(false)
  }

  const continueDisabled =
    mode === 'delivery' ? selectedId === null : false
  const continueLabel =
    mode === 'delivery' ? 'Continue to delivery →' : 'Continue to payment →'

  if (adding) {
    return (
      <div
        key="add"
        className="px-4 pt-5 animate-slide-from-right"
        id="address-section"
      >
        <AddressInlineForm
          onCancel={() => setAdding(false)}
          onSaved={handleSaved}
          canGoBack={addresses.length > 0}
        />
      </div>
    )
  }

  return (
    <div
      key="list"
      className="px-4 pt-5 space-y-4 animate-fade-in"
      id="address-section"
    >
      <div>
        <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary mb-2">
          How do you want it?
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <ModeCard
            active={mode === 'delivery'}
            Icon={HomeIcon}
            title="Deliver"
            sub="To your address"
            fee={`₹${deliveryFee}`}
            onClick={() => onModeChange('delivery')}
          />
          <ModeCard
            active={mode === 'pickup'}
            Icon={ShieldIcon}
            title="Self pickup"
            sub="Kothrud store"
            fee="FREE"
            onClick={() => onModeChange('pickup')}
          />
        </div>
      </div>

      {mode === 'delivery' ? (
        <div className="space-y-3">
          <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
            Delivery address
          </div>
          {loading ? (
            <>
              <div className="h-20 rounded-[14px] bg-surface-muted animate-pulse" />
              <div className="h-20 rounded-[14px] bg-surface-muted animate-pulse" />
            </>
          ) : (
            addresses.map(addr => (
              <AddressCard
                key={addr.id}
                address={addr}
                active={selectedId === addr.id}
                onSelect={() => onSelect(addr.id)}
              />
            ))
          )}

          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-[14px] py-3.5 text-[13px] font-bold text-ink-secondary"
          >
            <PlusIcon size={16} /> Add new address
          </button>
        </div>
      ) : (
        <div className="rounded-[14px] border border-line-soft bg-surface p-4 space-y-1.5">
          <div className="text-[14px] font-extrabold text-ink">
            Pick up from our Kothrud store
          </div>
          <div className="text-[12px] text-ink-muted leading-snug">
            Open 10 AM – 8 PM. Carry a photo ID. Address & directions will be
            sent over WhatsApp after payment.
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-50"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}

function ModeCard({
  active,
  Icon,
  title,
  sub,
  fee,
  onClick,
}: {
  active: boolean
  Icon: React.ComponentType<{size?: number; className?: string}>
  title: string
  sub: string
  fee: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-[14px] p-3 transition-colors ${
        active
          ? 'bg-surface border-2 border-ink'
          : 'bg-surface border-2 border-transparent ring-1 ring-line-soft'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
          active ? 'bg-accent text-ink' : 'bg-surface-muted text-ink-secondary'
        }`}
      >
        <Icon size={18} />
      </div>
      <div className="text-[14px] font-extrabold text-ink leading-tight">
        {title}
      </div>
      <div className="text-[11px] text-ink-muted mt-0.5 leading-tight">
        {sub}
      </div>
      <div className="font-mono text-[13px] font-extrabold text-ink mt-1.5">
        {fee}
      </div>
    </button>
  )
}

function AddressCard({
  address,
  active,
  onSelect,
}: {
  address: ILocation
  active: boolean
  onSelect: () => void
}) {
  const label = address.name ?? 'Address'
  const line = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.postal_code,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-start gap-3 text-left rounded-[14px] p-4 transition-colors ${
        active
          ? 'bg-surface border border-ink'
          : 'bg-surface border border-line-soft'
      }`}
    >
      <span
        aria-hidden
        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          active ? 'border-ink' : 'border-line'
        }`}
      >
        {active && (
          <span className="block w-2.5 h-2.5 rounded-full bg-ink" />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-extrabold text-ink">{label}</div>
        <div className="text-[12px] text-ink-muted mt-0.5 leading-snug">
          {line || 'Saved address'}
        </div>
      </div>
    </button>
  )
}
