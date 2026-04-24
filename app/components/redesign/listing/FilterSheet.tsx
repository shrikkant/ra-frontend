'use client'

import React from 'react'
import Sheet from '../Sheet'
import {IProductSubCategory} from '../../../../app-store/types'
import FilterPanel, {BrandOption} from './FilterPanel'

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  citySlug: string
  subCategories: IProductSubCategory[]
  activeSubCategorySlug?: string
  brands?: BrandOption[]
  priceMin?: number
  priceMax?: number
}

export default function FilterSheet({
  open,
  onClose,
  citySlug,
  subCategories,
  activeSubCategorySlug,
  brands = [],
  priceMin = 400,
  priceMax = 2500,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label="Filters" maxHeight="85vh">
      <FilterPanel
        variant="sheet"
        citySlug={citySlug}
        subCategories={subCategories}
        activeSubCategorySlug={activeSubCategorySlug}
        brands={brands}
        priceMin={priceMin}
        priceMax={priceMax}
        onApplied={onClose}
      />
    </Sheet>
  )
}
