import React from 'react'
import BookingForm from '../BookingForm'
import {PRODUCT_LAYOUT, CARD_STYLES} from './constants'
import {BookingFormSectionProps} from './types'

export const BookingFormSection: React.FC<BookingFormSectionProps> = ({
  productId,
  discount,
  rate,
  rates,
}) => {
  return (
    <div className={PRODUCT_LAYOUT.BOOKING_FORM_WIDTH}>
      <div className="md:sticky md:top-8 md:h-fit">
        <div className={CARD_STYLES.BOOKING_CARD}>
          <BookingForm
            discount={discount}
            rate={rate}
            rates={rates}
            productId={productId}
          />
        </div>
      </div>
    </div>
  )
}
