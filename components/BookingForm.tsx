'use client'
import React, {useEffect, useState, useCallback} from 'react'
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
import {InlineSignupCapture} from './booking/InlineSignupCapture'

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
  rate,
  rates,
}: {
  productId: number
  discount: number
  rate?: number | null // Primary rate (preferred)
  rates?: IProductRatePlan[] // @deprecated - kept for backward compatibility
}) {
  const dispatch = useDispatch()
  const [isClient, setIsClient] = React.useState(false)
  const [finalDiscount, setFinalDiscount] = useState(0)
  const [openFormInMobile, setOpenFormInMobile] = useState(false)
  const [showSignIn, setShowSignIn] = React.useState(false)
  const [showInlineSignup, setShowInlineSignup] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const loggedUser = useSelector(selectAuthState)
  const pathname = usePathname()

  const storeSearch = useSelector(getDefaultSearch)
  const router = useRouter()

  const {executeRecaptcha} = useRecaptcha()

  // Use rate prop first, fallback to rates array for backward compatibility
  const originalRate = rate || (rates && rates[0]?.rate) || 0
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
    // Prevent duplicate submissions
    if (isAddingToCart) return

    try {
      setIsAddingToCart(true)

      if (!storeSearch?.dates) return

      // Fire reCAPTCHA and GA tracking in parallel — don't block sequentially
      const [recaptchaToken] = await Promise.all([
        executeRecaptcha('add_to_cart'),
        trackGAEvent(GA_EVENTS.ADD_TO_CART, {
          product_id: productId,
          discounted_rate: discountedRate,
          rental_days: days,
          total_rent: discountedRate * days,
        }),
      ])

      // Show the next screen immediately (optimistic)
      if (!loggedUser) {
        dispatch(setLastLink('/p/mycart'))
        setShowInlineSignup(true)
      } else if (bookNow) {
        router.push('/p/mycart')
      } else {
        setOpenFormInMobile(false)
      }

      // Fire the API call — UI has already moved on
      const newCart: IOrder = await addToCart(
        productId,
        storeSearch?.dates,
        recaptchaToken,
      )

      if (newCart.id) {
        dispatch(setCart(newCart))
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const onBookNow = () => {
    window.analytics?.track('Book Now')
    onAddToCart(true)
  }

  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  const handleInlineSignupComplete = () => {
    setShowInlineSignup(false)
    setOpenFormInMobile(false)
    router.push('/p/mycart')
  }

  const handleInlineSignupSkip = () => {
    setShowInlineSignup(false)
    setOpenFormInMobile(false)
    router.push('/p/mycart')
  }

  const handleMobileBook = () => {
    setOpenFormInMobile(true)
  }

  const setBookingDates = useCallback((newDates: any) => {
    const search: any = {...storeSearch}
    search.dates = {
      startDate: '' + newDates.selection.startDate,
      endDate: '' + newDates.selection.endDate,
      key: 'selection',
    }
    dispatch(setSearch(search))
  }, [storeSearch, dispatch])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <div className="">
          {/* Desktop Form */}
          <div className="md:block hidden">
            {showInlineSignup ? (
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                <InlineSignupCapture
                  onComplete={handleInlineSignupComplete}
                  onSkip={handleInlineSignupSkip}
                />
              </div>
            ) : (
              <BookingFormContent
                storeSearch={storeSearch}
                onDateChange={setBookingDates}
                onBookNow={onBookNow}
                discountedRate={discountedRate}
                finalDiscount={finalDiscount}
                getDays={() => days}
                getPlural={getPlural}
                getSavings={getSavings}
                isLoading={isAddingToCart}
              />
            )}
          </div>

          {/* Mobile Bottom Bar */}
          {!openFormInMobile && (
            <MobileBookingBar
              originalRate={originalRate}
              finalDiscount={finalDiscount}
              onBookNow={handleMobileBook}
              showSignIn={showSignIn}
              isLoading={isAddingToCart}
            />
          )}

          {/* Mobile Full Screen Modal */}
          {openFormInMobile && (
            <MobileBookingModal onClose={() => {
              setOpenFormInMobile(false)
              setShowInlineSignup(false)
            }}>
              {showInlineSignup ? (
                <div className="p-6">
                  <InlineSignupCapture
                    onComplete={handleInlineSignupComplete}
                    onSkip={handleInlineSignupSkip}
                  />
                </div>
              ) : (
                <BookingFormContent
                  storeSearch={storeSearch}
                  onDateChange={setBookingDates}
                  onBookNow={onBookNow}
                  discountedRate={discountedRate}
                  finalDiscount={finalDiscount}
                  getDays={() => days}
                  getPlural={getPlural}
                  getSavings={getSavings}
                  isLoading={isAddingToCart}
                />
              )}
            </MobileBookingModal>
          )}

          {/* Sign In Modal */}
          {showSignIn && <SignIn onClose={closeSignInModal} />}
        </div>
      )}
    </>
  )
}
