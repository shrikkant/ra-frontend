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
import {OrderItemsReview} from 'components/order/OrderItemsReview'
import {ORDER_STEPS} from 'config/constants'
import {AddressPicker} from 'components/order/AddressPicker'
import Loader from 'components/Loader'
import {usePathname, useRouter} from 'next/navigation'
import {ILocation, IOrderItem} from '../../../../app-store/types'
import {PurchaseItem, trackPurchaseEvent} from '../../../../utils/analytics'
import {fetchAddresses} from '../../../../api/user/index.api'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {setLastLink} from '../../../../app-store/session/session.slice'
import SignIn from '../../../../components/user/SignIn'

export default function CartBook() {
  const cart = useSelector(getCart)
  const router = useRouter()
  const pathname = usePathname()
  const loggedUser = useSelector(selectAuthState)
  const [selectedAddress, setSelectedAddress] = useState<ILocation | null>()
  const [addressId, setAddressId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [addresses, setAddresses] = useState<ILocation[]>([])
  const [wantsToAddAddress, setWantsToAddAddress] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  const dispatch = useDispatch()

  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  const orderSuccess = () => {
    const orderId = cart?.id

    const items: PurchaseItem[] =
      cart?.items?.map((item: IOrderItem) => {
        return {
          item_id: item.id,
          item_name: item.product.title,
          price: item.rent,
          quantity: cart?.days || 0,
        }
      }) || []

    trackPurchaseEvent({
      transaction_id: orderId, // Required: Unique order ID
      value: cart.total_amount, // Required: Total purchase value
      currency: 'INR', // Your currency code
      items: items || [],
      // Optional but recommended:
      rental_days: cart?.days || 0,
      total_rent: cart?.amount,
    })

    dispatch(setCart(null))

    router.push(`/p/orders/${orderId}`)
  }
  const onRazorPayCheckout = async (mode: number) => {
    if (!loggedUser) {
      dispatch(setLastLink(pathname))
      setShowSignIn(true)

      return
    }

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
    setWantsToAddAddress(true)
    updateDeliveryAddressAction(cart, {id: -1, name: 'Store Pickup'})(dispatch)
  }

  const selectAddress = (addr: ILocation) => {
    if (cart) {
      setSelectedAddress(addr)
      setAddressId(addressId)
      updateDeliveryAddressAction(cart, addr)(dispatch)
      setLoading(false)
    }
  }

  const checkRadio = (addressIdStr: number) => {
    setLoading(true)
    setWantsToAddAddress(false)
    const addressId = parseInt(String(addressIdStr))
    const addr = addresses.find(ad => ad.id === addressId) || {
      id: -1,
      name: 'Store Pickup',
    }
    selectAddress(addr)
  }

  const resolveStep = () => {
    if (addresses.length === 0) {
      return ORDER_STEPS.ORDER_STEP_ADDRESS
    } else if (addressId !== 0 && !selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_DELIVERY
    } else if (selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_PAYMENT
    }
    return -1
  }

  const loadAddresses = async () => {
    try {
      const fetchedAddresses = await fetchAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      setAddresses([])
    }
  }

  const handleNewAddress = async () => {
    // Refresh addresses after adding a new one
    setWantsToAddAddress(false)
    await loadAddresses()
    // After adding address, if we now have 2+ addresses, show picker (keep selectedAddress null)
    // This is already handled because selectedAddress is null from clicking "Change"
  }

  useEffect(() => {
    if (!cart) {
      setLoading(true)
      fetchCart().then(data => {
        dispatch(setCart(data))
        setLoading(false)
      })
    }

    // Fetch addresses for both guest and logged-in users
    loadAddresses()
  }, [cart])

  // Auto-select ONLY first address when exactly one address exists (unless user wants to add new address)
  useEffect(() => {
    if (addresses.length === 1 && !selectedAddress && !wantsToAddAddress) {
      const firstAddress = addresses[0]
      setSelectedAddress(firstAddress)
      if (cart) {
        updateDeliveryAddressAction(cart, firstAddress)(dispatch)
      }
    }
    // If we have 2+ addresses and no selection and not wanting to add, reset to show picker
    if (addresses.length >= 2 && !selectedAddress && !wantsToAddAddress) {
      // Just ensure we're in picker mode, don't auto-select
      setWantsToAddAddress(false)
    }
  }, [addresses, selectedAddress, cart, dispatch, wantsToAddAddress])

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
                    addresses={addresses}
                    onNewAddress={handleNewAddress}
                    showAddForm={wantsToAddAddress}
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

      {/* Sign In Modal */}
      {showSignIn && <SignIn onClose={closeSignInModal} />}
    </div>
  )
}
