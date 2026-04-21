'use client'

import React from 'react'
import {TruckIcon, BoltIcon, ShieldIcon} from '../icons'

export type DeliveryOption = 'same-day' | 'scheduled' | 'pickup'

interface OptionDef {
  key: DeliveryOption
  Icon: React.ComponentType<{size?: number; className?: string}>
  title: string
  sub: string
  fee: string
  popular?: boolean
}

const OPTIONS: OptionDef[] = [
  {
    key: 'same-day',
    Icon: BoltIcon,
    title: 'Same day',
    sub: 'By 8 PM today',
    fee: '₹99',
    popular: true,
  },
  {
    key: 'scheduled',
    Icon: TruckIcon,
    title: 'Scheduled',
    sub: 'Pick a 2-hour window',
    fee: '₹149',
  },
  {
    key: 'pickup',
    Icon: ShieldIcon,
    title: 'Self pickup',
    sub: 'Kothrud store',
    fee: 'FREE',
  },
]

interface DeliveryStepProps {
  selected: DeliveryOption
  onSelect: (k: DeliveryOption) => void
  onContinue: () => void
}

export default function DeliveryStep({
  selected,
  onSelect,
  onContinue,
}: DeliveryStepProps) {
  return (
    <div className="px-4 pt-5 space-y-3">
      <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
        How should we deliver?
      </div>
      {OPTIONS.map(opt => {
        const active = selected === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`w-full flex items-center gap-3 text-left rounded-[14px] p-3 ${
              active
                ? 'bg-surface border border-ink'
                : 'bg-surface border border-line-soft'
            }`}
          >
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                active
                  ? 'bg-accent text-ink'
                  : 'bg-surface-muted text-ink-secondary'
              }`}
            >
              <opt.Icon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[14px] font-extrabold text-ink">
                  {opt.title}
                </div>
                {opt.popular && (
                  <span className="bg-accent text-ink text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-kicker">
                    Popular
                  </span>
                )}
              </div>
              <div className="text-[12px] text-ink-muted mt-0.5">
                {opt.sub}
              </div>
            </div>
            <div className="font-mono text-[14px] font-extrabold text-ink shrink-0">
              {opt.fee}
            </div>
          </button>
        )
      })}

      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5"
        >
          Continue to payment →
        </button>
      </div>
    </div>
  )
}
