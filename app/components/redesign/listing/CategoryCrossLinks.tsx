import React from 'react'
import Link from 'next/link'
import {capitalizeCity} from 'util/category.util'
import type {
  IProductFilter,
  IProductSubCategory,
} from '../../../../app-store/types'

interface CategoryCrossLinksProps {
  filter: IProductFilter
  slug: string[]
  subCategories: IProductSubCategory[]
  activeSubCategorySlug?: string
  max?: number
}

// "Other gear in <city>" rail. Crawlable internal links to sibling
// sub-categories in the same city. Adds the country prefix when present
// (e.g., /nz/auckland/<sub>).
export default function CategoryCrossLinks({
  filter,
  slug,
  subCategories,
  activeSubCategorySlug,
  max = 8,
}: CategoryCrossLinksProps) {
  const cityLabel = filter.city
    ? capitalizeCity(filter.city)
    : filter.state
      ? capitalizeCity(filter.state)
      : undefined

  if (!cityLabel) return null

  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== filter.city
  const cityPath = isCountryPrefixed
    ? slug.slice(0, 2).join('/')
    : (filter.city ?? filter.state ?? '')

  const items = subCategories
    .filter(sc => sc.slug && sc.slug !== activeSubCategorySlug)
    .slice(0, max)

  if (items.length === 0) return null

  return (
    <section
      aria-labelledby="other-gear-heading"
      className="px-4 lg:px-0 mt-10 lg:mt-12"
    >
      <h2
        id="other-gear-heading"
        className="text-[18px] lg:text-[22px] font-extrabold tracking-tight-md text-ink"
      >
        Other gear in {cityLabel}
      </h2>
      <p className="mt-1 text-[13px] text-ink-secondary">
        Same city, different kit. Browse and rent.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map(sc => (
          <li key={sc.id ?? sc.slug}>
            <Link
              href={`/${cityPath}/${sc.slug}`}
              className="inline-flex items-center px-3.5 py-2 rounded-full border border-line-soft text-[13px] text-ink hover:bg-surface-muted transition-colors no-underline"
            >
              {sc.title} in {cityLabel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
