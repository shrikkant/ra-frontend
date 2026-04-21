import React from 'react'
import {TruckIcon, ShieldIcon, BoltIcon} from '../icons'

const ITEMS = [
  {Icon: TruckIcon, title: 'Same-day', sub: 'doorstep delivery'},
  {Icon: ShieldIcon, title: 'Zero deposit', sub: 'verified renters'},
  {Icon: BoltIcon, title: 'Instant KYC', sub: 'under 60 seconds'},
] as const

export default function TrustStrip() {
  return (
    <div className="px-4 pt-5">
      <div className="flex items-stretch gap-2.5 bg-surface border border-line rounded-[18px] p-4">
        {ITEMS.map((item, i) => (
          <React.Fragment key={item.title}>
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <item.Icon size={22} className="text-ink" />
              <div>
                <div className="text-[13px] font-extrabold text-ink">
                  {item.title}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {item.sub}
                </div>
              </div>
            </div>
            {i < ITEMS.length - 1 && (
              <div aria-hidden className="w-px self-stretch bg-line mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
