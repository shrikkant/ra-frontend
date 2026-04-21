import React from 'react'

export default function EmptyState({
  hint = 'Try widening the filters',
}: {hint?: string}) {
  return (
    <div className="text-center py-20 px-8">
      <div
        aria-hidden
        className="mx-auto w-16 h-16 rounded-full border border-line-soft flex items-center justify-center text-[28px] text-ink-subtle"
      >
        ⌀
      </div>
      <div className="text-[16px] font-extrabold text-ink mt-4">
        No gear matches
      </div>
      <div className="text-[13px] text-ink-muted mt-1">{hint}</div>
    </div>
  )
}
