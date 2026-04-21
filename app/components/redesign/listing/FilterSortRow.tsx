'use client'

import React from 'react'
import {useRouter, usePathname, useSearchParams} from 'next/navigation'
import {SlidersIcon} from '../icons'

interface FilterSortRowProps {
  count: number
  activeFilterCount: number
  onOpenFilters: () => void
}

const SORT_OPTIONS = [
  {value: '', label: 'Popular'},
  {value: 'price-asc', label: '₹ low → high'},
  {value: 'price-desc', label: '₹ high → low'},
  {value: 'rated', label: 'Top rated'},
] as const

export default function FilterSortRow({
  count,
  activeFilterCount,
  onOpenFilters,
}: FilterSortRowProps) {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const sort = searchParams?.get('sort') ?? ''

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (e.target.value) params.set('sort', e.target.value)
    else params.delete('sort')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <button
        type="button"
        onClick={onOpenFilters}
        className="relative inline-flex items-center gap-2 bg-surface border border-line rounded-full px-3.5 py-2 text-[13px] font-semibold text-ink"
      >
        <SlidersIcon size={16} />
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-accent text-ink text-[10px] font-extrabold font-mono px-1">
            {activeFilterCount}
          </span>
        )}
      </button>
      <div className="text-[12px] font-mono text-ink-muted shrink-0">
        {count} {count === 1 ? 'item' : 'items'}
      </div>
      <div className="relative">
        <select
          value={sort}
          onChange={onSortChange}
          aria-label="Sort"
          className="appearance-none bg-surface border border-line rounded-full pl-3 pr-7 py-2 text-[13px] font-semibold text-ink"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted text-[10px]"
        >
          ▾
        </span>
      </div>
    </div>
  )
}
