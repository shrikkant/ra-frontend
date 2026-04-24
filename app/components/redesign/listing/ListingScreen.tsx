'use client'

import React, {useMemo, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {
  IProduct,
  IProductCategory,
  IProductFilter,
  IProductSubCategory,
} from '../../../../app-store/types'
import MobileChrome from '../MobileChrome'
import ProductTile from '../ProductTile'
import CategoryRail from '../home/CategoryRail'
import SearchHeader from './SearchHeader'
import FilterSortRow from './FilterSortRow'
import ProductRow from './ProductRow'
import EmptyState from './EmptyState'
import FilterSheet from './FilterSheet'
import FilterPanel from './FilterPanel'

const HIDDEN_SUBCATEGORY_IDS = new Set([59, 60, 62, 48, 32, 50, 30])

interface BrandOption {
  id: number
  name: string
}

interface ListingScreenProps {
  products: IProduct[]
  filter: IProductFilter
  categories: IProductCategory[]
  initialQuery?: string
  brands?: BrandOption[]
}

function sortProducts(products: IProduct[], sort: string): IProduct[] {
  if (!sort) return products
  const rated = (p: IProduct) => p.rate || p.rates?.[0]?.rate || 0
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => rated(a) - rated(b))
  if (sort === 'price-desc') return copy.sort((a, b) => rated(b) - rated(a))
  if (sort === 'rated') {
    return copy.sort(
      (a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0),
    )
  }
  return copy
}

export default function ListingScreen({
  products,
  filter,
  categories,
  initialQuery = '',
  brands = [],
}: ListingScreenProps) {
  const searchParams = useSearchParams()
  const sort = searchParams?.get('sort') ?? ''

  const subCategories: IProductSubCategory[] = useMemo(
    () =>
      (categories?.[0]?.subCategories ?? []).filter(
        sc => sc.id && !HIDDEN_SUBCATEGORY_IDS.has(sc.id),
      ),
    [categories],
  )

  const activeSubCategorySlug = useMemo(() => {
    if (!filter?.subCategory) return undefined
    for (const cat of categories ?? []) {
      const sc = cat.subCategories?.find(s => s.id === filter.subCategory)
      if (sc?.slug) return sc.slug
    }
    return undefined
  }, [filter?.subCategory, categories])

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])

  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount =
    (filter?.brand?.length ?? 0) + (filter?.rate ? 1 : 0)

  return (
    <MobileChrome>
      <SearchHeader initialQuery={initialQuery} autoFocus={!initialQuery} />
      {/* Mobile: chip rail on top of results. Desktop: chips also useful as
          quick switchers above the grid. */}
      <CategoryRail
        subCategories={subCategories}
        city={filter.city ?? 'pune'}
      />

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:mt-2">
        {/* Desktop sidebar — sticky filter panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-surface border border-line-soft rounded-[18px] overflow-hidden">
            <FilterPanel
              variant="sidebar"
              citySlug={filter.city ?? 'pune'}
              subCategories={subCategories}
              activeSubCategorySlug={activeSubCategorySlug}
              brands={brands}
            />
          </div>
        </aside>

        <div>
          {/* Filter button is mobile-only (sidebar handles it on desktop). */}
          <div className="lg:hidden">
            <FilterSortRow
              count={products.length}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setFiltersOpen(true)}
            />
          </div>
          <div className="hidden lg:flex items-center justify-between px-0 py-3">
            <div className="text-[14px] font-mono text-ink-muted">
              {products.length} items
            </div>
          </div>

          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Mobile: row list */}
              <ul className="md:hidden divide-y divide-line-soft bg-surface mt-1">
                {sorted.map(p => (
                  <li key={p.id}>
                    <ProductRow product={p} />
                  </li>
                ))}
              </ul>
              {/* Tablet/desktop: tile grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map(p => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        citySlug={filter.city ?? 'pune'}
        subCategories={subCategories}
        activeSubCategorySlug={activeSubCategorySlug}
        brands={brands}
      />
    </MobileChrome>
  )
}
