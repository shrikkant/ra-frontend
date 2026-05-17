import React from 'react'
import {CheckIcon} from '../../icons'

export type StepStatus = 'done' | 'todo'

/** Small spinner that adapts to light (`dark`) or dark backgrounds. */
export function Spinner({dark}: {dark?: boolean}) {
  return (
    <span
      aria-hidden
      className={`inline-block w-4 h-4 rounded-full border-2 animate-spin ${
        dark
          ? 'border-ink border-t-transparent'
          : 'border-surface border-t-transparent'
      }`}
    />
  )
}

export function StatusPill({status}: {status: StepStatus}) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 bg-success/15 text-success text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-kicker shrink-0">
        <CheckIcon size={10} strokeWidth={3} />
        Verified
      </span>
    )
  }
  return (
    <span className="inline-flex items-center bg-accent text-ink text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-kicker shrink-0">
      To do
    </span>
  )
}

export default function StepCard({
  icon,
  title,
  subtitle,
  status,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  status: StepStatus
  children?: React.ReactNode
}) {
  return (
    <div className="bg-surface border border-line-soft rounded-[18px] p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            status === 'done'
              ? 'bg-success text-surface'
              : 'bg-ink text-surface'
          }`}
        >
          {status === 'done' ? (
            <CheckIcon size={18} strokeWidth={3} />
          ) : (
            icon
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-extrabold text-ink leading-tight">
              {title}
            </h3>
            <StatusPill status={status} />
          </div>
          {subtitle && (
            <p className="text-[12px] text-ink-secondary mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
