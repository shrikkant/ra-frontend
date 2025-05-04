'use client'
import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from 'app-store/user/orders/orders.slice'
import {useDispatch, useSelector} from 'react-redux'
import {fetchCart} from 'api/user/orders.api'
import React, {useEffect, useState} from 'react'
import OrderSummary from 'components/OrderSummary'
import {displayRazorpay} from 'util/razorpay.util'
import {authUser, selectAuthState} from 'app-store/auth/auth.slice'
import {OrderItemsReview} from 'components/order/OrderItemsReview'
import {ORDER_STEPS, STATUS_AADHAAR_VERIFIED} from 'config/constants'
import {AddressPicker} from 'components/order/AddressPicker'
import Loader from 'components/Loader'
import {getAuthUser} from '../../../../api/auth.api'
import {useRouter} from 'next/navigation'
import {ILocation} from '../../../../app-store/types'

export default function CartBook() {
  const cart = useSelector(getCart)
  const router = useRouter()
  const loggedUser = useSelector(selectAuthState)
  const [selectedAddress, setSelectedAddress] = useState<ILocation | null>()
  const [addressId, setAddressId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const dispatch = useDispatch()

  const orderSuccess = () => {
    dispatch(setCart(null))
    if (loggedUser?.verified !== STATUS_AADHAAR_VERIFIED) {
      router.push('/p/profile/verify')
      return
    }

    router.push('/p/orders')
  }
  const onRazorPayCheckout = async (mode: number) => {
    if (cart) {
      if (mode === ORDER_STEPS.ORDER_STEP_PAYMENT) {
        setIsButtonLoading(true)
        displayRazorpay(cart.id, orderSuccess).then(() => {
          setIsButtonLoading(false)
        })
      }
    }
  }

  const changeAddress = () => {
    setSelectedAddress(null)
    updateDeliveryAddressAction(cart, {id: -1, name: 'Store Pickup'})(dispatch)
  }

  const selectAddress = addr => {
    if (cart) {
      setSelectedAddress(addr)
      setAddressId(addressId)
      updateDeliveryAddressAction(cart, addr)(dispatch)
      setLoading(false)
    }
  }

  const checkRadio = (addressIdStr: number) => {
    setLoading(true)
    const addressId = parseInt(String(addressIdStr))
    const addr = loggedUser?.address?.find(ad => ad.id === addressId) || {
      id: -1,
      name: 'Store Pickup',
    }
    selectAddress(addr)
  }

  const resolveStep = () => {
    if (!loggedUser || !loggedUser.address || loggedUser.address.length === 0) {
      return ORDER_STEPS.ORDER_STEP_ADDRESS
    } else if (addressId !== 0 && !selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_DELIVERY
    } else if (selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_PAYMENT
    }
    return -1
  }

  useEffect(() => {
    if (!loggedUser) {
      getAuthUser().then(user => dispatch(authUser(user)))
    }

    if (!cart) {
      setLoading(true)
      fetchCart().then(data => {
        dispatch(setCart(data))
        setLoading(false)
      })
    }
  }, [cart, loggedUser])

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {cart ? (
            <div
              className={
                'flex flex-col-reverse md:flex-row w-full xs:pb-20 gap-x-4 pt-4  rounded-md'
              }
            >
              <div className={'md:w-3/4 w-full'}>
                <div className="border border-gray-300 rounded-md p-4 flex flex-col gap-y-4 xs:m-4">
                  <AddressPicker
                    onAddressPick={checkRadio}
                    onAddressReset={changeAddress}
                    selectedAddress={selectedAddress}
                  ></AddressPicker>

                  {selectedAddress && (
                    <OrderItemsReview
                      title="Shopping Cart"
                      order={cart}
                    ></OrderItemsReview>
                  )}
                </div>
              </div>

              <div className={'md:w-1/4 w-full'}>
                <div className="md:fixed md:w-max w-full top-32 xs:p-4 md:p-0">
                  <OrderSummary
                    order={cart}
                    step={resolveStep()}
                    isLoading={isButtonLoading}
                    onCallToAction={onRazorPayCheckout}
                  ></OrderSummary>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
    </div>
  )
}
