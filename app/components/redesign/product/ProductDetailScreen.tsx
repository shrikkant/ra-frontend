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
import InlineCTA from './InlineCTA'
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

      {/* lg+: hero left / meta+CTA right; below lg: stacked */}
      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:pt-6">
        <div className="lg:rounded-[28px] lg:overflow-hidden lg:border lg:border-line-soft">
          <HeroImage product={product} />
        </div>

        <div>
          <MetaRow product={product} />

          {featureChips.length > 0 && (
            <div className="px-4 lg:px-0 mt-3 flex flex-wrap gap-2">
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

          {/* Inline CTA at md+ — replaces the StickyCTABar at desktop. */}
          <div className="hidden md:block px-4 lg:px-0 mt-4">
            <InlineCTA product={product} />
          </div>
        </div>
      </div>

      {/* Below the hero/meta split — content tabs and breakdowns are
          full-width but capped to the reading column at desktop. */}
      <div className="lg:max-w-3xl">
        <ContentTabs product={product} />
        <RentalBreakdown
          rate={rate}
          productDiscountPercent={product.discount_percent ?? 0}
        />
        <SavingsLadder />
      </div>

      {/* StickyCTABar is mobile-only — InlineCTA serves desktop. */}
      <div className="md:hidden">
        <StickyCTABar product={product} />
      </div>
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
