'use client'

import React from 'react'
import {ArrowLeftIcon} from '../icons'

interface StepperProps {
  step: number // 1..5
  total?: number
  title: string
  onBack: () => void
}

export default function Stepper({step, total = 5, title, onBack}: StepperProps) {
  return (
    <div className="px-4 pt-1.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink shrink-0"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-extrabold text-ink leading-tight truncate">
            {title}
          </div>
        </div>
        <div className="font-mono text-[12px] text-ink-muted">
          {step}/{total}
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        {Array.from({length: total}).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i < step ? 'bg-ink' : 'bg-surface-muted'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
