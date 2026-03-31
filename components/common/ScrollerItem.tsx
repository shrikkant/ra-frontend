import React from 'react'

interface ScrollerItemProps {
  children: React.ReactNode
  /** Mobile width, e.g. "w-[55vw]" */
  mobileWidth: string
  /** Snap alignment: "center" | "start" */
  snap?: 'center' | 'start'
  className?: string
}

export default function ScrollerItem({
  children,
  mobileWidth,
  snap = 'center',
  className = '',
}: ScrollerItemProps) {
  return (
    <div
      className={`flex-shrink-0 ${mobileWidth} ${snap === 'center' ? 'snap-center' : 'snap-start'} md:w-auto ${className}`}
    >
      {children}
    </div>
  )
}
