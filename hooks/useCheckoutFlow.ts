'use client'
import {useEffect, useState, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/navigation'
import {getCart, setCart, updateDeliveryAddressAction} from 'app-store/user/orders/orders.slice'
import {fetchCart} from 'api/user/orders.api'
import {fetchAddresses} from 'api/user/index.api'
import {displayRazorpay} from 'util/razorpay.util'
import {ORDER_STEPS} from 'config/constants'
import {ILocation, IOrderItem} from 'app-store/types'
import {PurchaseItem, trackPurchaseEvent} from '../utils/analytics'

export function useCheckoutFlow() {
  const cart = useSelector(getCart)
  const router = useRouter()
  const dispatch = useDispatch()

  const [selectedAddress, setSelectedAddress] = useState<ILocation | null>()
  const [loading, setLoading] = useState(true)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [addresses, setAddresses] = useState<ILocation[]>([])
  const [addressesLoaded, setAddressesLoaded] = useState(false)

  // --- Step resolution ---

  const resolveStep = useCallback(() => {
    if (addresses.length === 0) return ORDER_STEPS.ORDER_STEP_ADDRESS
    if (!selectedAddress) return ORDER_STEPS.ORDER_STEP_DELIVERY
    return ORDER_STEPS.ORDER_STEP_PAYMENT
  }, [addresses.length, selectedAddress])

  // --- Data fetching ---

  const loadAddresses = useCallback(async () => {
    try {
      const fetched = await fetchAddresses()
      setAddresses(fetched)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      setAddresses([])
    } finally {
      setAddressesLoaded(true)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchCart(), loadAddresses()])
      .then(([cartData]) => {
        dispatch(setCart(cartData))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // --- Address actions ---

  const selectAddress = useCallback(
    (addressId: number) => {
      const addr = addresses.find(ad => ad.id === addressId) || {
        id: -1,
        name: 'Store Pickup',
      }
      if (cart) {
        setSelectedAddress(addr)
        updateDeliveryAddressAction(cart, addr)(dispatch)
      }
    },
    [addresses, cart, dispatch],
  )

  const resetAddress = useCallback(() => {
    setSelectedAddress(null)
  }, [])

  const handleNewAddress = useCallback(async () => {
    await loadAddresses()
  }, [loadAddresses])

  // --- Payment ---

  const trackAndRedirect = useCallback(() => {
    if (!cart) return
    const orderId = cart.id
    const items: PurchaseItem[] =
      cart.items?.map((item: IOrderItem) => ({
        item_id: item.id,
        item_name: item.product.title,
        price: item.rent,
        quantity: cart.days || 0,
      })) || []

    trackPurchaseEvent({
      transaction_id: orderId,
      value: cart.total_amount,
      currency: 'INR',
      items,
      rental_days: cart.days || 0,
      total_rent: cart.amount,
    })

    dispatch(setCart(null))
    router.push(`/p/orders/${orderId}`)
  }, [cart, dispatch, router])

  const handleCtaClick = useCallback(
    (step: number) => {
      if (!cart) return
      switch (step) {
        case ORDER_STEPS.ORDER_STEP_DELIVERY: {
          const el = document.getElementById('address-section')
          if (el) el.scrollIntoView({behavior: 'smooth'})
          break
        }
        case ORDER_STEPS.ORDER_STEP_PAYMENT: {
          setIsPaymentLoading(true)
          displayRazorpay(cart.id, trackAndRedirect).then(() => {
            setIsPaymentLoading(false)
          })
          break
        }
      }
    },
    [cart, trackAndRedirect],
  )

  // --- Computed values ---

  const totalAmount = cart
    ? Number(cart.amount || 0) + Number(cart.delivery_fee || 0)
    : 0

  const currentStep = resolveStep()
  const showStickyCta = currentStep !== ORDER_STEPS.ORDER_STEP_ADDRESS

  return {
    cart,
    loading,
    isPaymentLoading,
    addresses,
    addressesLoaded,
    selectedAddress,
    currentStep,
    totalAmount,
    showStickyCta,
    selectAddress,
    resetAddress,
    handleNewAddress,
    handleCtaClick,
  }
}
