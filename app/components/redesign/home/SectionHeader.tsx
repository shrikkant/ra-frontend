import React from 'react'
import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: string
  actionHref?: string
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between px-4 md:px-0 pt-6 md:pt-10 pb-3 md:pb-5">
      <div>
        <h2 className="text-[20px] md:text-[24px] lg:text-[28px] font-extrabold tracking-tight-md text-ink leading-tight">
          {title}
        </h2>
        {subtitle && (
          <div className="font-mono text-[12px] md:text-[13px] text-ink-muted mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="text-[13px] md:text-[14px] font-semibold text-ink no-underline"
        >
          {action} →
        </Link>
      )}
    </div>
  )
}
