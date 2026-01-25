/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {ProductDetailsSection} from './ProductDetailsSection'
import {BookingFormSection} from './BookingFormSection'
import {ReviewsSection} from '../ReviewsSection'
import {PRODUCT_LAYOUT, REVIEWS_CONFIG} from './constants'
import {ProductProps} from './types'

export const Product: React.FC<ProductProps> = ({product}) => {
  const addons: any = product?.masterProductList
  const rate = product?.rate
  const rates: any = product?.rates // @deprecated - kept for backward compatibility

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Main Product Container */}
      <div className={`${PRODUCT_LAYOUT.CONTAINER_MAX_WIDTH} mx-auto py-8`}>
        {/* Product Layout - Flexbox with standard width classes */}
        <div className={`flex flex-col md:flex-row ${PRODUCT_LAYOUT.GAP}`}>
          {/* Product Details Section - 2/3 width */}
          <ProductDetailsSection product={product} addons={addons} />

          {/* Booking Form Section - 1/3 width */}
          <BookingFormSection
            productId={product.id}
            discount={product?.discount_percent}
            rate={rate}
            rates={rates}
          />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewsSection
        title={REVIEWS_CONFIG.title}
        subtitle={REVIEWS_CONFIG.subtitle}
        variant={REVIEWS_CONFIG.variant}
        maxReviews={REVIEWS_CONFIG.maxReviews}
        showCTA={REVIEWS_CONFIG.showCTA}
        className={REVIEWS_CONFIG.className}
      />
    </div>
  )
}
