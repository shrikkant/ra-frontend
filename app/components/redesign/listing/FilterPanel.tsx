'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {useRouter, usePathname, useSearchParams} from 'next/navigation'
import {IProductSubCategory} from '../../../../app-store/types'

export interface BrandOption {
  id: number
  name: string
}

export interface FilterPanelProps {
  citySlug: string
  subCategories: IProductSubCategory[]
  activeSubCategorySlug?: string
  brands?: BrandOption[]
  priceMin?: number
  priceMax?: number
  /** Called after Apply when the user has chosen filters. */
  onApplied?: () => void
  /**
   * `sheet` shows the Apply CTA stuck to the bottom (used inside a
   * Sheet wrapper). `sidebar` shows it inline.
   */
  variant?: 'sheet' | 'sidebar'
}

function parseBrandIds(raw: string | null): Set<number> {
  if (!raw) return new Set()
  return new Set(
    raw
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !Number.isNaN(n)),
  )
}

function parseRate(raw: string | null, fallback: number): number {
  if (!raw) return fallback
  const parts = raw.split('-')
  const n = parseInt(parts[1] ?? parts[0], 10)
  return Number.isNaN(n) ? fallback : n
}

export default function FilterPanel({
  citySlug,
  subCategories,
  activeSubCategorySlug,
  brands = [],
  priceMin = 400,
  priceMax = 2500,
  onApplied,
  variant = 'sheet',
}: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()

  const initialBrands = useMemo(
    () => parseBrandIds(searchParams?.get('br') ?? null),
    [searchParams],
  )
  const initialMaxPrice = useMemo(
    () => parseRate(searchParams?.get('rf') ?? null, priceMax),
    [searchParams, priceMax],
  )

  const [selectedSubCat, setSelectedSubCat] = useState<string | undefined>(
    activeSubCategorySlug,
  )
  const [selectedBrands, setSelectedBrands] = useState<Set<number>>(initialBrands)
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice)

  // Sync local state to URL changes (eg. user navigated to a different sub).
  useEffect(() => {
    setSelectedSubCat(activeSubCategorySlug)
    setSelectedBrands(initialBrands)
    setMaxPrice(initialMaxPrice)
  }, [activeSubCategorySlug, initialBrands, initialMaxPrice])

  const toggleBrand = (id: number) => {
    setSelectedBrands(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const apply = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')

    if (selectedBrands.size > 0) {
      params.set('br', Array.from(selectedBrands).join(','))
    } else {
      params.delete('br')
    }

    if (maxPrice < priceMax) {
      params.set('rf', `${priceMin}-${maxPrice}`)
    } else {
      params.delete('rf')
    }
    params.delete('page')

    const targetPath =
      selectedSubCat && selectedSubCat !== activeSubCategorySlug
        ? `/${citySlug}/${selectedSubCat}`
        : pathname
    const qs = params.toString()
    router.push(qs ? `${targetPath}?${qs}` : targetPath)
    onApplied?.()
  }

  const clearAll = () => {
    setSelectedBrands(new Set())
    setMaxPrice(priceMax)
    setSelectedSubCat(undefined)
  }

  const applyButton = (
    <button
      type="button"
      onClick={apply}
      className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5"
    >
      Apply filters
    </button>
  )

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-1 pb-3">
        <div className="text-[20px] font-extrabold tracking-tight-md text-ink">
          Filters
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="text-[13px] font-semibold text-ink-secondary"
        >
          Clear all
        </button>
      </div>

      {subCategories.length > 0 && (
        <FilterSection title="Category">
          <div className="flex flex-wrap gap-2">
            <Chip
              active={!selectedSubCat}
              onClick={() => setSelectedSubCat(undefined)}
              label="All"
            />
            {subCategories.map(sc => (
              <Chip
                key={sc.id ?? sc.slug}
                active={selectedSubCat === sc.slug}
                onClick={() => setSelectedSubCat(sc.slug)}
                label={sc.title}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="flex flex-wrap gap-2">
            {brands.map(b => (
              <Chip
                key={b.id}
                active={selectedBrands.has(b.id)}
                onClick={() => toggleBrand(b.id)}
                label={b.name}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection
        title="Max price / day"
        trailing={
          <span className="font-mono text-[14px] font-bold text-ink">
            ₹{maxPrice}
          </span>
        }
      >
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          step={50}
          value={maxPrice}
          onChange={e => setMaxPrice(parseInt(e.target.value, 10))}
          aria-label="Maximum price per day"
          className="w-full accent-ink"
        />
        <div className="flex justify-between font-mono text-[11px] text-ink-muted mt-1">
          <span>₹{priceMin}</span>
          <span>₹{priceMax}</span>
        </div>
      </FilterSection>

      {variant === 'sheet' ? (
        <div className="sticky bottom-0 bg-surface border-t border-line p-4">
          {applyButton}
        </div>
      ) : (
        <div className="px-4 py-4 border-t border-line-soft">{applyButton}</div>
      )}
    </div>
  )
}

function FilterSection({
  title,
  trailing,
  children,
}: {
  title: string
  trailing?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="px-4 py-4 border-t border-line-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
          {title}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border whitespace-nowrap ${
        active
          ? 'bg-ink text-surface border-ink'
          : 'bg-surface text-ink border-line'
      }`}
    >
      {label}
    </button>
  )
}
