import React from 'react'
import {capitalizeCity} from 'util/category.util'
import type {IProductFilter} from '../../../../app-store/types'

interface ListingHeroProps {
  filter: IProductFilter
  subCategoryTitle?: string
  productCount?: number
  topBrands?: string[]
  totalBrands?: number
  priceFrom?: number
  customH1?: string
  customIntro?: string
}

// Composes a short, factual intro using whatever live data we have.
// Numbers come straight from the listing's product list and brand meta —
// no DB call, no extra fetch. Pieces are conditional so a low-inventory
// or new (city × category) combo still produces clean prose.
function buildIntro({
  cityLabel,
  subjectLower,
  productCount,
  topBrands,
  totalBrands,
  priceFrom,
}: {
  cityLabel?: string
  subjectLower: string
  productCount?: number
  topBrands?: string[]
  totalBrands?: number
  priceFrom?: number
}): string {
  const inCity = cityLabel ? ` in ${cityLabel}` : ''
  const parts: string[] = []

  if (productCount && productCount > 0) {
    parts.push(`${productCount} ${subjectLower}${inCity}.`)
  } else {
    parts.push(`${subjectLower.charAt(0).toUpperCase()}${subjectLower.slice(1)} for rent${inCity}.`)
  }

  if (topBrands && topBrands.length > 0) {
    const brandList = topBrands.slice(0, 3).join(', ')
    const more =
      totalBrands && totalBrands > topBrands.slice(0, 3).length
        ? ` and ${totalBrands - topBrands.slice(0, 3).length} more brand${totalBrands - topBrands.slice(0, 3).length === 1 ? '' : 's'}`
        : ''
    parts.push(`Top brands: ${brandList}${more}.`)
  }

  if (priceFrom && priceFrom > 0) {
    parts.push(`Daily rentals from ₹${priceFrom.toLocaleString('en-IN')}.`)
  }

  parts.push(cityLabel ? 'Free home delivery across the city.' : 'Free home delivery.')

  return parts.join(' ')
}

export default function ListingHero({
  filter,
  subCategoryTitle,
  productCount,
  topBrands,
  totalBrands,
  priceFrom,
  customH1,
  customIntro,
}: ListingHeroProps) {
  const cityLabel = filter.city
    ? capitalizeCity(filter.city)
    : filter.state
      ? capitalizeCity(filter.state)
      : undefined

  let h1: string
  let subjectLower: string

  if (subCategoryTitle && cityLabel) {
    h1 = `Rent ${subCategoryTitle} in ${cityLabel}`
    subjectLower = subCategoryTitle.toLowerCase()
  } else if (cityLabel) {
    h1 = `Camera & Photography Gear Rental in ${cityLabel}`
    subjectLower = 'cameras, lenses, drones and lights'
  } else if (subCategoryTitle) {
    h1 = `Rent ${subCategoryTitle} Across India`
    subjectLower = subCategoryTitle.toLowerCase()
  } else {
    h1 = 'Camera & Photography Gear Rental'
    subjectLower = 'cameras, lenses, drones and lights'
  }

  // Editorial overrides win when present.
  const renderedH1 = customH1?.trim() || h1
  const intro =
    customIntro?.trim() ||
    buildIntro({
      cityLabel,
      subjectLower,
      productCount,
      topBrands,
      totalBrands,
      priceFrom,
    })

  return (
    <header className="px-4 lg:px-0 pt-1 pb-4 lg:pb-6">
      <h1 className="text-[24px] lg:text-[36px] font-extrabold tracking-tight-lg leading-tight text-ink">
        {renderedH1}
      </h1>
      <p className="mt-2 text-[14px] lg:text-[15px] text-ink-secondary leading-relaxed max-w-3xl whitespace-pre-line">
        {intro}
      </p>
    </header>
  )
}
