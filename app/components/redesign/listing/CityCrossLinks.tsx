import React from 'react'
import Link from 'next/link'
import COUNTRIES from '../../../../config/constants'
import {capitalizeCity} from 'util/category.util'
import type {IProductFilter} from '../../../../app-store/types'

interface CityCrossLinksProps {
  filter: IProductFilter
  slug: string[]
  subCategorySlug?: string
  subCategoryTitle?: string
  max?: number
}

function citySlug(name: string): string {
  // Mirrors the slug normalisation used in app/[...slug]/page.tsx.
  const s = name.toLowerCase().replaceAll(' ', '-')
  return s === 'bengaluru' ? 'bangalore' : s
}

// "<Category> in other cities" rail. Driven from config/constants.ts so it
// has zero data dependency. Stays within the current country, excludes the
// active city. Useful for both crawlers (internal-link graph) and answer
// engines that want to enumerate alternates.
export default function CityCrossLinks({
  filter,
  slug,
  subCategorySlug,
  subCategoryTitle,
  max = 8,
}: CityCrossLinksProps) {
  if (!subCategorySlug) return null

  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== filter.city
  const country = isCountryPrefixed
    ? COUNTRIES.find(c => c.code.toLowerCase() === slug[0])
    : COUNTRIES.find(c => c.code === 'IN')

  if (!country) return null

  const currentCitySlug = filter.city ? citySlug(filter.city) : undefined

  // De-dupe (constants.ts has 'Ahmedabad' twice) and exclude current.
  const seen = new Set<string>()
  const cities: string[] = []
  for (const name of country.locations) {
    const s = citySlug(name)
    if (seen.has(s)) continue
    seen.add(s)
    if (s === currentCitySlug) continue
    cities.push(name)
    if (cities.length >= max) break
  }

  if (cities.length === 0) return null

  const displayLabel = subCategoryTitle ?? 'Cameras'
  const countryPrefix = country.urlBase ? country.urlBase.replace(/\/$/, '') : ''

  return (
    <section
      aria-labelledby="other-cities-heading"
      className="px-4 lg:px-0 mt-8 lg:mt-10"
    >
      <h2
        id="other-cities-heading"
        className="text-[18px] lg:text-[22px] font-extrabold tracking-tight-md text-ink"
      >
        {displayLabel} in other cities
      </h2>
      <p className="mt-1 text-[13px] text-ink-secondary">
        Travelling? Pick up the same kit elsewhere.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cities.map(name => {
          const path = countryPrefix
            ? `/${countryPrefix}/${citySlug(name)}/${subCategorySlug}`
            : `/${citySlug(name)}/${subCategorySlug}`
          return (
            <li key={name + path}>
              <Link
                href={path}
                className="inline-flex items-center px-3.5 py-2 rounded-full border border-line-soft text-[13px] text-ink hover:bg-surface-muted transition-colors no-underline"
              >
                {displayLabel} in {capitalizeCity(name)}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
