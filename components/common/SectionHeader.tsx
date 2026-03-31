import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  /** Optional element to render on the right side (desktop only) */
  trailing?: React.ReactNode
}

export default function SectionHeader({
  title,
  subtitle,
  trailing,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-5 sm:mb-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 hidden sm:block">{subtitle}</p>
        )}
      </div>
      {trailing}
    </div>
  )
}
