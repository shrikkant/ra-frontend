import React from 'react'
import Link from 'next/link'
import {SearchIcon, MicIcon} from '../icons'

interface SearchPillProps {
  href?: string
  placeholder?: string
}

export default function SearchPill({
  href = '/pune/rent-camera?q=',
  placeholder = 'Canon R10, GoPro, 50mm…',
}: SearchPillProps) {
  return (
    <div className="md:hidden px-4 pt-3">
      <Link
        href={href}
        className="flex items-center gap-2.5 bg-surface border border-line rounded-[18px] h-12 pl-3.5 pr-2 text-[15px] text-ink-muted no-underline"
      >
        <SearchIcon size={20} className="text-ink-secondary shrink-0" />
        <span className="flex-1 truncate">{placeholder}</span>
        <button
          type="button"
          aria-label="Voice search"
          className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-ink"
        >
          <MicIcon size={18} />
        </button>
      </Link>
    </div>
  )
}
