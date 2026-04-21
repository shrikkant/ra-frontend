'use client'

import React, {useState} from 'react'
import {IProduct} from '../../../../app-store/types'
import MobileChrome from '../MobileChrome'
import FloatingHeader from './FloatingHeader'
import HeroImage from './HeroImage'
import MetaRow from './MetaRow'
import RentalCard from './RentalCard'
import ContentTabs from './ContentTabs'
import RentalBreakdown from './RentalBreakdown'
import SavingsLadder from './SavingsLadder'
import StickyCTABar from './StickyCTABar'
import DatePickerSheet from './DatePickerSheet'

interface ProductDetailScreenProps {
  product: IProduct
}

export default function ProductDetailScreen({
  product,
}: ProductDetailScreenProps) {
  const [datesOpen, setDatesOpen] = useState(false)
  const rate = product.rate || product.rates?.[0]?.rate || 0
  const featureChips = featureChipsFor(product)

  return (
    <MobileChrome topPad="none" hideTabBar bottomPad="cta">
      <FloatingHeader />
      <HeroImage product={product} />
      <MetaRow product={product} />

      {featureChips.length > 0 && (
        <div className="px-4 mt-3 flex flex-wrap gap-2">
          {featureChips.map(chip => (
            <span
              key={chip}
              className="text-[12px] font-semibold text-ink bg-surface border border-line rounded-lg px-2.5 py-1"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <RentalCard onEdit={() => setDatesOpen(true)} />
      <ContentTabs product={product} />
      <RentalBreakdown
        rate={rate}
        productDiscountPercent={product.discount_percent ?? 0}
      />
      <SavingsLadder />

      <StickyCTABar product={product} />
      <DatePickerSheet open={datesOpen} onClose={() => setDatesOpen(false)} />
    </MobileChrome>
  )
}

function featureChipsFor(product: IProduct): string[] {
  const features = product.masterProduct?.details_json?.features as
    | Array<{[k: string]: string}>
    | undefined
  if (!features?.length) return []
  return features
    .slice(0, 4)
    .map(f => Object.keys(f)[0])
    .filter(Boolean)
}
