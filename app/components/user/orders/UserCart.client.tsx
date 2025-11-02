'use client'

import {getCart, setCart} from 'app-store/user/orders/orders.slice'
import {useDispatch, useSelector} from 'react-redux'
import {fetchCart, removeFromCart} from 'api/user/orders.api'
import React, {useEffect, useState} from 'react'
import OrderSummary from 'components/OrderSummary'
import {ORDER_STEPS} from 'config/constants'

import EmptyCart from 'components/cart/EmptyCart'
import Loader from 'components/Loader'
import {IOrderItem} from 'app-store/types'
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
    setLoading(true)
    await removeFromCart(id)
    const cart = await fetchCart()
    dispatch(setCart(cart))
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    if (!cart) {
      fetchCart().then(data => {
        dispatch(setCart(data))
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {cart ? (
            <div className={'flex flex-col md:flex-row w-full  xs:pb-20'}>
              <div className={'md:w-3/4 w-full'}>
                <div className="py-4">
                  <div className={'border rounded-md border-gray-400'}>
                    {cart.items &&
                      cart.items.map((item: IOrderItem) => (
                        <OrderItemRow
                          key={item.id}
                          onRemove={onRemove}
                          orderItem={item}
                          orderStep={ORDER_STEPS.ORDER_STEP_CART}
                        />
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
      )}
    </>
  )
}
