'use client'

import React, {Suspense, useEffect, useMemo, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {
  IProduct,
  IProductCategory,
  IProductFilter,
  IProductSubCategory,
} from '../../../../app-store/types'
import {IFAQ} from '../../../../app-store/app-defaults/types'
import MobileChrome from '../MobileChrome'
import ProductTile from '../ProductTile'
import CategoryRail from '../home/CategoryRail'
import SearchHeader from './SearchHeader'
import FilterSortRow from './FilterSortRow'
import ProductRow from './ProductRow'
import EmptyState from './EmptyState'
import FilterSheet from './FilterSheet'
import FilterPanel from './FilterPanel'
import Breadcrumbs from './Breadcrumbs'
import ListingHero from './ListingHero'
import CategoryCrossLinks from './CategoryCrossLinks'
import CityCrossLinks from './CityCrossLinks'
import AuthoredBody from './AuthoredBody'
import FAQSection from '../../../../components/faq/FAQSection'

const HIDDEN_SUBCATEGORY_IDS = new Set([59, 60, 62, 48, 32, 50, 30])

// Reads the URL's ?q= and ?sort= and pushes them up to the parent's state.
// Lives inside a tight <Suspense> so that during SSG, useSearchParams
// suspends *here* (with a null fallback) instead of bubbling up and
// preventing the entire ListingScreen from prerendering. After hydration,
// useSearchParams resolves and the parent re-renders with real values.
function SearchParamsSync({
  onChange,
}: {
  onChange: (q: string, sort: string) => void
}) {
  const searchParams = useSearchParams()
  const q = searchParams?.get('q') ?? ''
  const sort = searchParams?.get('sort') ?? ''
  useEffect(() => {
    onChange(q, sort)
  }, [q, sort, onChange])
  return null
}

interface BrandOption {
  id: number
  name: string
}

interface ListingScreenProps {
  products: IProduct[]
  filter: IProductFilter
  categories: IProductCategory[]
  brands?: BrandOption[]
  faqs?: IFAQ[]
  slug?: string[]
  totalCount?: number
  customH1?: string
  customIntro?: string
  authoredBody?: any[]
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
  brands = [],
  faqs = [],
  slug,
  totalCount,
  customH1,
  customIntro,
  authoredBody,
}: ListingScreenProps) {
  // Hold q/sort as local state with empty defaults so the products grid
  // renders fully in SSR HTML (no useSearchParams suspension at this
  // level). SearchParamsSync below feeds real URL values in once
  // hydrated.
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('')
  const handleParamsChange = React.useCallback((q: string, s: string) => {
    setQuery(q)
    setSort(s)
  }, [])
  const initialQuery = query

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(p => p.title?.toLowerCase().includes(q))
  }, [products, query])

  const subCategories: IProductSubCategory[] = useMemo(
    () =>
      (categories?.[0]?.subCategories ?? []).filter(
        sc => sc.id && !HIDDEN_SUBCATEGORY_IDS.has(sc.id),
      ),
    [categories],
  )

  const activeSubCategory = useMemo(() => {
    if (!filter?.subCategory) return undefined
    for (const cat of categories ?? []) {
      const sc = cat.subCategories?.find(s => s.id === filter.subCategory)
      if (sc) return sc
    }
    return undefined
  }, [filter?.subCategory, categories])

  const activeSubCategorySlug = activeSubCategory?.slug

  // Live facts for the hero + JSON-LD. Computed from data already on the
  // page (response.results + response.meta.brands) — no extra fetch.
  const priceFrom = useMemo(() => {
    const rates = products
      .map(p => p.rate ?? p.rates?.[0]?.rate ?? 0)
      .filter(r => typeof r === 'number' && r > 0) as number[]
    return rates.length ? Math.min(...rates) : undefined
  }, [products])

  const topBrands = useMemo(
    () => brands.slice(0, 3).map(b => b.name).filter(Boolean),
    [brands],
  )

  const sorted = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  )

  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount =
    (filter?.brand?.length ?? 0) + (filter?.rate ? 1 : 0)

  const slugForBreadcrumb =
    slug && slug.length > 0
      ? slug
      : ([filter.city].filter(Boolean) as string[])

  return (
    <MobileChrome showMobileNav>
      {/* Tight Suspense around useSearchParams — lets the page SSG without
          deopting the whole tree. Fallback null is fine: the only effect
          of empty params is "no filter applied", which is the right SSR
          default for a listing page anyway. */}
      <Suspense fallback={null}>
        <SearchParamsSync onChange={handleParamsChange} />
      </Suspense>
      <Breadcrumbs
        filter={filter}
        slug={slugForBreadcrumb}
        subCategoryTitle={activeSubCategory?.title}
      />
      <ListingHero
        filter={filter}
        subCategoryTitle={activeSubCategory?.title}
        productCount={totalCount}
        topBrands={topBrands}
        totalBrands={brands.length}
        priceFrom={priceFrom}
        customH1={customH1}
        customIntro={customIntro}
      />
      <SearchHeader initialQuery={initialQuery} autoFocus={false} />
      {/* Mobile: chip rail on top of results. Desktop: chips also useful as
          quick switchers above the grid. */}
      <CategoryRail
        subCategories={subCategories}
        city={filter.city ?? 'pune'}
      />

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:mt-2">
        {/* Desktop sidebar — sticky filter panel. FilterPanel uses
            useSearchParams; wrap in Suspense so it doesn't deopt the
            page from SSG. Filters render after hydration (~ms post-LCP). */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-surface border border-line-soft rounded-[18px] overflow-hidden">
            <Suspense fallback={null}>
              <FilterPanel
                variant="sidebar"
                citySlug={filter.city ?? 'pune'}
                subCategories={subCategories}
                activeSubCategorySlug={activeSubCategorySlug}
                brands={brands}
              />
            </Suspense>
          </div>
        </aside>

        <div>
          {/* Filter button is mobile-only (sidebar handles it on desktop).
              FilterSortRow uses useSearchParams; same Suspense treatment. */}
          <div className="lg:hidden">
            <Suspense fallback={null}>
              <FilterSortRow
                count={products.length}
                activeFilterCount={activeFilterCount}
                onOpenFilters={() => setFiltersOpen(true)}
              />
            </Suspense>
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
              {/* Mobile: row list. Above-the-fold ~4 rows render eagerly so
                  whichever wins LCP is already loading. The very first
                  row also gets fetchpriority=high to race CSS/JS. */}
              <ul className="md:hidden divide-y divide-line-soft bg-surface mt-1">
                {sorted.map((p, i) => (
                  <li key={p.id}>
                    <ProductRow product={p} eager={i < 4} priority={i === 0} />
                  </li>
                ))}
              </ul>
              {/* Tablet/desktop: tile grid. Up to 8 tiles are above the
                  fold on xl (2 rows × 4 cols) — load those eagerly. The
                  very first one is typically the LCP, so flag it as
                  priority (fetchpriority=high). */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map((p, i) => (
                  <ProductTile
                    key={p.id}
                    product={p}
                    eager={i < 8}
                    priority={i === 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Authored long-form content sits below the product grid so the
          inventory is above the fold (Amazon-style listing UX). Crawlers
          and answer engines still read it — they don't care about order. */}
      {authoredBody && authoredBody.length > 0 && (
        <AuthoredBody body={authoredBody} />
      )}

      <CategoryCrossLinks
        filter={filter}
        slug={slugForBreadcrumb}
        subCategories={subCategories}
        activeSubCategorySlug={activeSubCategorySlug}
      />
      <CityCrossLinks
        filter={filter}
        slug={slugForBreadcrumb}
        subCategorySlug={activeSubCategorySlug}
        subCategoryTitle={activeSubCategory?.title}
      />

      {faqs.length > 0 && <FAQSection faqs={faqs} />}

      <Suspense fallback={null}>
        <FilterSheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          citySlug={filter.city ?? 'pune'}
          subCategories={subCategories}
          activeSubCategorySlug={activeSubCategorySlug}
          brands={brands}
        />
      </Suspense>
    </MobileChrome>
  )
}
