'use client'

import {getCart, setCart} from 'app-store/user/orders/orders.slice'
import {useDispatch, useSelector} from 'react-redux'
import {fetchCart, removeFromCart} from 'api/user/orders.api'
import React, {useEffect, useState} from 'react'
import OrderSummary from 'components/OrderSummary'
import {ORDER_STEPS} from 'config/constants'

import EmptyCart from 'components/cart/EmptyCart'
import {IOrder, IOrderItem} from 'app-store/types'
import OrderItemRow from 'components/OrderItemRow'
import {usePathname, useRouter} from 'next/navigation'
import SignIn from '../../../../components/user/SignIn'
import {setLastLink} from '../../../../app-store/session/session.slice'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'

export default function UserCart() {
  const router = useRouter()
  const loggedUser = useSelector(selectAuthState)
  const pathname = usePathname()
  const cart = useSelector(getCart)
  const [loading, setLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState<number | null>(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const dispatch = useDispatch()
  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  const onRazorPayCheckout = () => {
    if (!loggedUser) {
      dispatch(setLastLink('/p/mycart/book'))
      setShowSignIn(true)

      return
    }
    router.push('/p/mycart/book')
  }

  const onRemove = async (id: number) => {
    // Optimistic update: remove item from cart immediately
    const previousCart = cart
    if (cart?.items) {
      const optimisticItems = cart.items.filter((item: IOrderItem) => item.id !== id)
      const optimisticCart = {...cart, items: optimisticItems}
      dispatch(setCart(optimisticCart as IOrder))
    }
    setRemovingItemId(id)

    try {
      await removeFromCart(id)
      const updatedCart = await fetchCart()
      dispatch(setCart(updatedCart))
    } catch {
      // Rollback on error
      dispatch(setCart(previousCart))
    } finally {
      setRemovingItemId(null)
    }
  }

  useEffect(() => {
    // Always fetch fresh cart data — addToCart returns a minimal payload
    setLoading(true)
    fetchCart().then(data => {
      dispatch(setCart(data))
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4 w-full">
            <div className="border rounded-md border-gray-200 divide-y divide-gray-100">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/4 w-full">
            <div className="p-4 border border-gray-200 rounded-md animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
              <div className="h-px bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
              <div className="h-10 bg-amber-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {cart ? (
        <div className={'flex flex-col md:flex-row w-full  xs:pb-20'}>
          <div className={'md:w-3/4 w-full'}>
            <div className="py-4">
              <div className={'border rounded-md border-gray-400'}>
                {cart.items &&
                  cart.items.map((item: IOrderItem) => (
                    <div
                      key={item.id}
                      className={`transition-opacity duration-200 ${removingItemId === item.id ? 'opacity-50' : ''}`}
                    >
                      <OrderItemRow
                        onRemove={onRemove}
                        orderItem={item}
                        orderStep={ORDER_STEPS.ORDER_STEP_CART}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className={'md:w-1/4 w-full'}>
            <div className="md:fixed top-24 md:w-80 w-full py-4">
              <OrderSummary
                order={cart}
                step={ORDER_STEPS.ORDER_STEP_CART}
                onCallToAction={onRazorPayCheckout}
              ></OrderSummary>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
      {/* Sign In Modal */}
      {showSignIn && <SignIn onClose={closeSignInModal} />}
    </>
  )
}
