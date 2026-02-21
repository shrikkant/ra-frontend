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

  const [selectedAddress, setSelectedAddress] = useState<ILocation | null>()
  const [addressId, setAddressId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [addresses, setAddresses] = useState<ILocation[]>([])
  const [addressesLoaded, setAddressesLoaded] = useState(false)

  const dispatch = useDispatch()

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
    } else if (!selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_DELIVERY
    } else {
      return ORDER_STEPS.ORDER_STEP_PAYMENT
    }
  }

  const loadAddresses = async () => {
    try {
      const fetchedAddresses = await fetchAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      setAddresses([])
    } finally {
      setAddressesLoaded(true)
    }
  }

  const handleNewAddress = async () => {
    // Refresh addresses after adding a new one, stay on delivery options screen
    await loadAddresses()
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


  return (
    <div>
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="md:w-3/4 space-y-4">
              <div className="border rounded-md p-4 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="md:w-1/4">
              <div className="p-4 border rounded-md space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-10 bg-amber-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {cart ? (
            <div
              className={
                'flex flex-col-reverse md:flex-row w-full xs:pb-20 gap-x-4 pt-4  rounded-md'
              }
            >
              <div className={'md:w-3/4 w-full'}>
                <div className="border border-gray-300 rounded-md p-4 flex flex-col gap-y-4 xs:m-4 transition-all duration-300 ease-in-out">
                  <AddressPicker
                    onAddressPick={checkRadio}
                    onAddressReset={changeAddress}
                    selectedAddress={selectedAddress}
                    addresses={addresses}
                    addressesLoaded={addressesLoaded}
                    onNewAddress={handleNewAddress}
                  ></AddressPicker>

                  <div className={`transition-all duration-300 ease-in-out ${selectedAddress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 h-0 overflow-hidden'}`}>
                    {selectedAddress && (
                      <OrderItemsReview
                        title="Shopping Cart"
                        order={cart}
                      ></OrderItemsReview>
                    )}
                  </div>
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
