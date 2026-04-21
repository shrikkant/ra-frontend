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
import CategoryRail from '../home/CategoryRail'
import SearchHeader from './SearchHeader'
import FilterSortRow from './FilterSortRow'
import ProductRow from './ProductRow'
import EmptyState from './EmptyState'
import FilterSheet from './FilterSheet'

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
      <CategoryRail
        subCategories={subCategories}
        city={filter.city ?? 'pune'}
      />
      <FilterSortRow
        count={products.length}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-line-soft bg-surface mt-1">
          {sorted.map(p => (
            <li key={p.id}>
              <ProductRow product={p} />
            </li>
          ))}
        </ul>
      )}

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
