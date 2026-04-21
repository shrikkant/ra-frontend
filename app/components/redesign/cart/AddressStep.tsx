'use client'

import React from 'react'
import {ILocation} from '../../../../app-store/types'
import {PlusIcon} from '../icons'

interface AddressStepProps {
  addresses: ILocation[]
  loading: boolean
  selectedId: number | null
  onSelect: (id: number) => void
  onContinue: () => void
  onAddNew: () => void
}

export default function AddressStep({
  addresses,
  loading,
  selectedId,
  onSelect,
  onContinue,
  onAddNew,
}: AddressStepProps) {
  return (
    <div className="px-4 pt-5 space-y-3" id="address-section">
      <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
        Delivery address
      </div>
      {loading ? (
        <>
          <div className="h-20 rounded-[14px] bg-surface-muted animate-pulse" />
          <div className="h-20 rounded-[14px] bg-surface-muted animate-pulse" />
        </>
      ) : addresses.length === 0 ? (
        <div className="rounded-[14px] border border-line-soft p-4 text-[13px] text-ink-muted">
          No saved addresses yet. Add one to continue.
        </div>
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
        onClick={onAddNew}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-[14px] py-3.5 text-[13px] font-bold text-ink-secondary"
      >
        <PlusIcon size={16} /> Add new address
      </button>

      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          disabled={selectedId === null}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-50"
        >
          Continue to delivery →
        </button>
      </div>
    </div>
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
