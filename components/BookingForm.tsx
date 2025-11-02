'use client'
import React, {useEffect, useState} from 'react'
import {addToCart} from '../api/user/orders.api'
import {usePathname, useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  getDefaultSearch,
  setLastLink,
  setSearch,
} from 'app-store/session/session.slice'
import {selectAuthState} from '../app-store/auth/auth.slice'
import {setCart} from '../app-store/user/orders/orders.slice'
import SignIn from './user/SignIn'

import {IOrder, IProductRatePlan} from '../app-store/types'
import {trackGAEvent, GA_EVENTS} from '../utils/analytics'
import {useRecaptcha} from '../hooks/useRecaptcha'

// Import modular components
import {BookingFormContent} from './booking/BookingFormContent'
import {MobileBookingBar} from './booking/MobileBookingBar'
import {MobileBookingModal} from './booking/MobileBookingModal'

// Import utilities
import {
  getDays,
  getPlural,
  calculateFinalDiscount,
  calculateDiscountedRate,
  calculateSavings,
} from './booking/bookingUtils'

export default function BookingForm({
  productId,
  discount,
  rates,
}: {
  productId: number
  discount: number
  rates: IProductRatePlan[]
}) {
  const dispatch = useDispatch()
  const [isClient, setIsClient] = React.useState(false)
  const [finalDiscount, setFinalDiscount] = useState(0)
  const [openFormInMobile, setOpenFormInMobile] = useState(false)
  const [showSignIn, setShowSignIn] = React.useState(false)

  const storeSearch = useSelector(getDefaultSearch)
  const router = useRouter()

  const {executeRecaptcha} = useRecaptcha()

  const originalRate = rates[0].rate
  const discountedRate = calculateDiscountedRate(originalRate, finalDiscount)

  // Calculate days and discount
  const days = getDays(storeSearch)
  const getSavings = () => calculateSavings(originalRate, discountedRate, days)

  // Update discount when days change
  useEffect(() => {
    const newFinalDiscount = calculateFinalDiscount(discount, days)
    setFinalDiscount(newFinalDiscount)
  }, [discount, days])

  const onAddToCart = async (bookNow?: boolean) => {
    // if (!loggedUser && pathname && pathname?.length > 0) {
    //   dispatch(setLastLink(pathname))
    //   setShowSignIn(true)
    // } else {

    try {
      // Execute reCAPTCHA before adding to cart (bot protection)
      const recaptchaToken = await executeRecaptcha('add_to_cart')

      trackGAEvent(GA_EVENTS.ADD_TO_CART, {
        product_id: productId,
        discounted_rate: discountedRate,
        rental_days: days,
        total_rent: discountedRate * days,
      })

      if (!storeSearch?.dates) return

      const newCart: IOrder = await addToCart(
        productId,
        storeSearch?.dates,
        recaptchaToken,
      )

      if (newCart.id) {
        dispatch(setCart(newCart))

        if (bookNow) {
          router.push('/p/mycart')
        } else {
          setOpenFormInMobile(false)
        }
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      // You might want to show a user-friendly error message here
      // For example: toast.error('Failed to add to cart. Please try again.')
    }
    // }
  }

  const onBookNow = () => {
    window.analytics?.track('Book Now')
    onAddToCart(true)
  }

  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  const handleMobileBook = () => {
    // if (!loggedUser?.id) {
    //   setShowSignIn(true)
    // } else {
    setOpenFormInMobile(true)
    // }
  }

  const setBookingDates = (newDates: any) => {
    const search: any = {...storeSearch}
    search.dates = {
      startDate: '' + newDates.selection.startDate,
      endDate: '' + newDates.selection.endDate,
      key: 'selection',
    }
    dispatch(setSearch(search))
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <div className="">
          {/* Desktop Form */}
          <div className="md:block hidden">
            <BookingFormContent
              storeSearch={storeSearch}
              onDateChange={setBookingDates}
              onBookNow={onBookNow}
              discountedRate={discountedRate}
              finalDiscount={finalDiscount}
              getDays={() => days}
              getPlural={getPlural}
              getSavings={getSavings}
            />
          </div>

          {/* Mobile Bottom Bar */}
          {!openFormInMobile && (
            <MobileBookingBar
              originalRate={originalRate}
              finalDiscount={finalDiscount}
              onBookNow={handleMobileBook}
              showSignIn={showSignIn}
            />
          )}

          {/* Mobile Full Screen Modal */}
          {openFormInMobile && (
            <MobileBookingModal onClose={() => setOpenFormInMobile(false)}>
              <BookingFormContent
                storeSearch={storeSearch}
                onDateChange={setBookingDates}
                onBookNow={onBookNow}
                discountedRate={discountedRate}
                finalDiscount={finalDiscount}
                getDays={() => days}
                getPlural={getPlural}
                getSavings={getSavings}
              />
            </MobileBookingModal>
          )}

          {/* Sign In Modal */}
          {showSignIn && <SignIn onClose={closeSignInModal} />}
        </div>
      )}
    </>
  )
}
