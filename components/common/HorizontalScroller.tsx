import React from 'react'

interface HorizontalScrollerProps {
  children: React.ReactNode
  /** Tailwind grid-cols classes for md+ breakpoint, e.g. "md:grid-cols-3 lg:grid-cols-4" */
  desktopCols: string
  className?: string
}

export default function HorizontalScroller({
  children,
  desktopCols,
  className = '',
}: HorizontalScrollerProps) {
  return (
    <div
      className={`flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 pl-4 pr-4 scrollbar-hide md:grid ${desktopCols} md:gap-4 md:overflow-visible md:snap-none md:pb-0 md:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  )
}
