'use client'

import {useCallback, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {addToCart as addToCartApi} from '../../../api/user/orders.api'
import {setCart} from '../../../app-store/user/orders/orders.slice'
import {
  getDefaultSearch,
  setLastLink,
} from '../../../app-store/session/session.slice'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import {useRecaptcha} from '../../../hooks/useRecaptcha'
import {trackGAEvent, GA_EVENTS} from '../../../utils/analytics'

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
    async ({productId, productName, fromRect}: AddArgs) => {
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
        trackGAEvent(GA_EVENTS.ADD_TO_CART, {product_id: productId})
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
        const recaptchaToken = await executeRecaptcha('add_to_cart').catch(
          () => undefined,
        )
        const newCart = await addToCartApi(
          productId,
          storeSearch.dates,
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
      executeRecaptcha,
      dispatch,
      router,
      flyTo,
    ],
  )

  return {add, fly, pendingId}
}
