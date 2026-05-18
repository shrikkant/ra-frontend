'use client'

import {useCallback, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {
  addToCart as addToCartApi,
  updateOrderDates,
} from '../../../api/user/orders.api'
import {getCart, setCart} from '../../../app-store/user/orders/orders.slice'
import {
  getDefaultSearch,
  setLastLink,
} from '../../../app-store/session/session.slice'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import {useRecaptcha} from '../../../hooks/useRecaptcha'
import {trackGAEvent, GA_EVENTS} from '../../../utils/analytics'
import {getDays} from '../../../components/booking/bookingUtils'
import {orderCalendarDate} from './home/dateUtils'
import {requestDateChoice} from './dateConflictStore'

/** Local-calendar-day key, for comparing windows ignoring time-of-day. */
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`

interface AddArgs {
  productId: number
  productName: string
  rate: number
  /** Source bounding rect — used to launch the fly-to-cart animation. */
  fromRect?: DOMRect | null
}

const cartTabRect = (): DOMRect | null => {
  if (typeof document === 'undefined') return null
  // Prefer the visible target — desktop nav is rendered at md+, mobile
  // tab bar at smaller widths. Both expose `data-cart-target`.
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-cart-target]'),
  )
  const visible = targets.find(el => el.offsetParent !== null) ?? targets[0]
  return visible ? visible.getBoundingClientRect() : null
}

export interface FlyClone {
  id: number
  fromX: number
  fromY: number
  width: number
  height: number
  toX: number
  toY: number
}

export function useAddToCart() {
  const dispatch = useDispatch()
  const router = useRouter()
  const loggedUser = useSelector(selectAuthState)
  const storeSearch = useSelector(getDefaultSearch) as any
  const cart = useSelector(getCart) as any
  const {executeRecaptcha} = useRecaptcha()
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [fly, setFly] = useState<FlyClone | null>(null)

  const flyTo = useCallback((from: DOMRect | null) => {
    if (!from) return
    const target = cartTabRect()
    if (!target) return
    const id = Date.now()
    setFly({
      id,
      fromX: from.left,
      fromY: from.top,
      width: from.width,
      height: from.height,
      toX: target.left + target.width / 2 - from.width / 2,
      toY: target.top + target.height / 2 - from.height / 2,
    })
    window.setTimeout(
      () => setFly(curr => (curr?.id === id ? null : curr)),
      900,
    )
  }, [])

  const add = useCallback(
    async ({productId, productName, rate, fromRect}: AddArgs) => {
      if (pendingId === productId) return

      // Callers gate on `hasDates` and route the user to the date picker
      // when missing, so by the time we get here dates are expected.
      // Keep a defensive guard in case of a wiring regression — silent,
      // not a user-facing toast.
      if (!storeSearch?.dates) {
        console.warn('useAddToCart called without dates set; skipping')
        return
      }

      flyTo(fromRect ?? null)

      try {
        const days = getDays(storeSearch)
        trackGAEvent(GA_EVENTS.ADD_TO_CART, {
          ecommerce: {
            currency: 'INR',
            value: rate * days,
            items: [
              {
                item_id: String(productId),
                item_name: productName,
                price: rate * days,
                quantity: 1,
                rental_days: days,
                daily_rate: rate,
              },
            ],
          },
        })
      } catch {
        /* analytics is best-effort */
      }

      // Guest path: route to /join immediately and run the API call in
      // the background. Awaiting recaptcha + addToCart before redirecting
      // adds 0.8–1.5s of perceived latency at a high-attrition moment;
      // the redirect itself is what the user is waiting for. The backend
      // claims the guest cart by session cookie after signup, so the
      // post-auth /p/mycart fetch picks up the product whether the BG
      // call has resolved or not.
      if (!loggedUser) {
        void (async () => {
          try {
            const recaptchaToken = await executeRecaptcha('add_to_cart').catch(
              () => undefined,
            )
            await addToCartApi(productId, storeSearch.dates, recaptchaToken)
          } catch (e) {
            console.error('Guest add-to-cart failed', e)
          }
        })()
        dispatch(setLastLink('/p/mycart'))
        router.push('/join')
        return
      }

      // Logged-in path: await so the in-place cart UI updates.
      setPendingId(productId)
      try {
        // The window this item is added (and availability-checked)
        // against. Defaults to what the user picked; the conflict
        // resolution below may swap it to the cart's existing window.
        let datesForAdd = storeSearch.dates

        // A cart order owns ONE rental window — the backend re-prices
        // every added item onto the order's dates. If this product was
        // picked for a different window than the cart already holds, ask
        // the user which window wins before adding, instead of letting
        // the mismatch happen silently (resolved by DateConflictHost).
        if (
          cart?.id &&
          (cart.items?.length ?? 0) > 0 &&
          cart.start_date &&
          cart.end_date
        ) {
          // Order timestamps must be read via UTC components, or an IST
          // browser sees the window a day wide of what was booked.
          const cartStart = orderCalendarDate(cart.start_date)
          const cartEnd = orderCalendarDate(cart.end_date)
          const pickStart = new Date(storeSearch.dates.startDate)
          const pickEnd = new Date(storeSearch.dates.endDate)
          const windowsDiffer =
            !isNaN(cartStart.getTime()) &&
            !isNaN(cartEnd.getTime()) &&
            !isNaN(pickStart.getTime()) &&
            !isNaN(pickEnd.getTime()) &&
            (ymd(cartStart) !== ymd(pickStart) ||
              ymd(cartEnd) !== ymd(pickEnd))

          if (windowsDiffer) {
            const choice = await requestDateChoice(
              {startDate: '' + cartStart, endDate: '' + cartEnd},
              {
                startDate: storeSearch.dates.startDate,
                endDate: storeSearch.dates.endDate,
              },
            )
            if (choice === 'picked') {
              // Re-price the whole order onto the newly picked window.
              try {
                const repriced = await updateOrderDates(cart.id, {
                  startDate: pickStart,
                  endDate: pickEnd,
                })
                if (repriced?.id) dispatch(setCart(repriced))
              } catch {
                // The interceptor surfaces the backend reason (e.g. an
                // existing cart item not free for the new window). Abort
                // the add — the cart is left untouched.
                return
              }
            } else {
              // Keep the cart's window: add (and availability-check) the
              // item against the dates it will actually be booked for,
              // not the wider range the user happened to have searched.
              datesForAdd = {
                startDate: '' + cartStart,
                endDate: '' + cartEnd,
                key: 'selection',
              }
            }
          }
        }

        const recaptchaToken = await executeRecaptcha('add_to_cart').catch(
          () => undefined,
        )
        const newCart = await addToCartApi(
          productId,
          datesForAdd,
          recaptchaToken,
        )
        if (newCart?.id) dispatch(setCart(newCart))
        toast.success(`Added ${productName} to cart`)
      } catch (e) {
        console.error('Add to cart failed', e)
        toast.error('Could not add to cart')
      } finally {
        setPendingId(null)
      }
    },
    [
      pendingId,
      loggedUser,
      storeSearch,
      cart,
      executeRecaptcha,
      dispatch,
      router,
      flyTo,
    ],
  )

  return {add, fly, pendingId}
}
