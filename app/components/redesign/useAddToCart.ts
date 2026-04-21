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
  const tab = document.querySelector('#ra-tab-bar [data-tab="cart"]')
  return tab ? (tab as HTMLElement).getBoundingClientRect() : null
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

      flyTo(fromRect ?? null)

      if (!loggedUser) {
        dispatch(setLastLink('/p/mycart'))
        router.push('/join')
        return
      }
      if (!storeSearch?.dates) {
        toast.error('Pick rental dates first')
        return
      }

      setPendingId(productId)
      try {
        try {
          trackGAEvent(GA_EVENTS.ADD_TO_CART, {product_id: productId})
        } catch {
          /* analytics is best-effort */
        }
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
