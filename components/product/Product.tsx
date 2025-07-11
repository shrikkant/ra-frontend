/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {HeadCard} from './HeadCard'
import {Package} from './Package'
import {Description} from './Description'
import BookingForm from '../BookingForm'
import {IProduct} from '../../app-store/types'
import {ReviewsSection} from '../ReviewsSection'

export const Product = ({product}: {product: IProduct}) => {
  const addons: any = product?.masterProductList
  const rates: any = product?.rates
  return (
    <>
      <div className="p-4">
        <div className={'flex flex-col sm:flex-row gap-4'}>
          <div className="sm:w-3/5 w-full md:w-3/4">
            <HeadCard product={product}></HeadCard>
            <div className="min-h-[50px]">
              {(addons && addons.length) > 0 && (
                <Package addons={addons}></Package>
              )}
            </div>
            <Description
              description={product?.masterProduct?.description}
              specifications={product?.masterProduct?.specifications}
            ></Description>
          </div>

          <div className={'sm:w-2/5 w-full md:w-1/4'}>
            <div className="sm:sticky sm:top-4 w-full max-w-[320px] mx-auto">
              <BookingForm
                discount={product?.discount_percent}
                rates={rates}
                productId={product.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewsSection
        title="Customer Reviews"
        subtitle="See what others are saying about our equipment"
        variant="compact"
        maxReviews={3}
        showCTA={false}
        className="mt-8"
      />
    </>
  )
}
