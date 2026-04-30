'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from '../../../../app-store/user/orders/orders.slice'
import {
  fetchCart,
  updateOrderFulfillment,
} from '../../../../api/user/orders.api'
import {fetchAddresses} from '../../../../api/user/index.api'
import {displayRazorpay} from '../../../../util/razorpay.util'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {
  getDefaultSearch,
  setLastLink,
} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween} from '../home/dateUtils'
import {ILocation, IOrder, IOrderItem} from '../../../../app-store/types'
import {
  PurchaseItem,
  trackPurchaseEvent,
} from '../../../../utils/analytics'

import MobileChrome from '../MobileChrome'
import DatePickerSheet from '../product/DatePickerSheet'
import Stepper from './Stepper'
import CartStep from './CartStep'
import AddressStep, {FulfillmentMode} from './AddressStep'
import DeliveryStep, {DeliveryTiming} from './DeliveryStep'
import PaymentStep, {PriceBreakdown} from './PaymentStep'
import DoneStep from './DoneStep'
import type {PaymentMethod} from '../../../../util/razorpay.util'

type Step = 1 | 2 | 3 | 4 | 5

const TITLES: Record<Step, string> = {
  1: 'Your cart',
  2: 'Delivery method',
  3: 'When do you need it?',
  4: 'Payment',
  5: 'All done',
}

const DELIVERY_BASE_FEE = 500
const SAME_DAY_SURCHARGE = 99
// Backend currently returns 0% (toffee/src/config/appConfig.ts → getTaxPercentage).
// Bump this and the backend together to switch GST on.
const GST_RATE = 0

function calculateFee(mode: FulfillmentMode, timing: DeliveryTiming) {
  if (mode === 'pickup') return 0
  return DELIVERY_BASE_FEE + (timing === 'same-day' ? SAME_DAY_SURCHARGE : 0)
}

function buildBreakdown(
  rental: number,
  mode: FulfillmentMode,
  timing: DeliveryTiming,
): PriceBreakdown {
  const deliveryFee = calculateFee(mode, timing)
  // Mirror backend: GST applies on rental amount only, then add delivery.
  // Math.ceil mirrors `Math.ceil((amount * tax) / 100)` in toffee/src/models/order.ts.
  const gst = Math.ceil((rental * GST_RATE) / 100)
  const total = rental + gst + deliveryFee

  let deliveryLabel: string
  if (mode === 'pickup') {
    deliveryLabel = 'Self pickup'
  } else if (timing === 'same-day') {
    deliveryLabel = `Delivery (same-day · ₹${DELIVERY_BASE_FEE} + ₹${SAME_DAY_SURCHARGE})`
  } else {
    deliveryLabel = 'Delivery (tomorrow or later)'
  }

  return {rental, deliveryFee, deliveryLabel, gstRate: GST_RATE, gst, total}
}

export default function CartCheckoutScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector(getCart) as IOrder | null | undefined
  const loggedUser = useSelector(selectAuthState)

  const [step, setStep] = useState<Step>(1)
  const [cartLoading, setCartLoading] = useState(true)
  // Tracks "redux cart matches what the server has for this logged-in
  // user." On first mount, redux can hold a stale guest cart ID (from a
  // pre-signup add-to-cart) that the merge has since invalidated —
  // pushing fulfillment against that ID returns "Order not found" and
  // gets auto-toasted by the axios interceptor. We gate any cart-id-
  // dependent side effects on this flag so they only fire post-fetch.
  const [cartReady, setCartReady] = useState(false)
  const [addresses, setAddresses] = useState<ILocation[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  )
  const [mode, setMode] = useState<FulfillmentMode>('delivery')
  const [timing, setTiming] = useState<DeliveryTiming>('same-day')
  const [datesOpen, setDatesOpen] = useState(false)
  const [finalOrderId, setFinalOrderId] = useState<number | null>(null)
  const storeSearch = useSelector(getDefaultSearch) as any

  useEffect(() => {
    if (!loggedUser) {
      dispatch(setLastLink('/p/mycart'))
      router.push('/join')
      return
    }
    setCartLoading(true)
    setCartReady(false)
    setAddressesLoading(true)
    fetchCart()
      .then(data => {
        dispatch(setCart(data))
        setCartReady(true)
      })
      .catch(() => setCartReady(true))
      .finally(() => setCartLoading(false))
    fetchAddresses()
      .then(list => setAddresses(list ?? []))
      .catch(() => setAddresses([]))
      .finally(() => setAddressesLoading(false))
  }, [loggedUser, dispatch, router])

  const totalSteps = mode === 'pickup' ? 4 : 5
  // Display step skips the timing step when picking up.
  const displayStep =
    mode === 'pickup' && step >= 4 ? step - 1 : step

  const goBack = useCallback(() => {
    if (step === 1) {
      router.push('/')
      return
    }
    if (step === 4 && mode === 'pickup') {
      setStep(2)
      return
    }
    setStep(s => (Math.max(1, s - 1) as Step))
  }, [step, router, mode])

  const selectAddress = useCallback(
    (id: number) => {
      setSelectedAddressId(id)
      const addr = addresses.find(a => a.id === id)
      if (addr && cart) {
        updateDeliveryAddressAction(cart, addr)(dispatch)
      }
    },
    [addresses, cart, dispatch],
  )

  const handleAddressAdded = useCallback(
    (addr: ILocation) => {
      setAddresses(prev => [addr, ...prev.filter(a => a.id !== addr.id)])
      setSelectedAddressId(addr.id)
      if (cart) {
        updateDeliveryAddressAction(cart, addr)(dispatch)
      }
    },
    [cart, dispatch],
  )

  // Whenever fulfillment mode or timing changes, push the canonical
  // delivery_fee to the cart on the server so Razorpay charges the right
  // amount. The backend recomputes fee + total from the constants in
  // toffee/src/config/appConfig.ts, so the frontend cannot drift.
  const cartId = cart?.id
  useEffect(() => {
    // Wait for the fresh fetch — pushing fulfillment against a stale
    // (e.g., pre-merge guest) cart ID returns "Order not found" and the
    // axios interceptor surfaces that as an unwanted toast.
    if (!cartReady || !cartId) return
    let cancelled = false
    updateOrderFulfillment(cartId, mode, timing)
      .then(updated => {
        if (!cancelled && updated) dispatch(setCart(updated))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [cartReady, cartId, mode, timing, dispatch])

  const advanceFromAddress = useCallback(() => {
    setStep(mode === 'delivery' ? 3 : 4)
  }, [mode])

  const trackAndFinish = useCallback(() => {
    if (!cart) return
    const orderId = cart.id
    const items: PurchaseItem[] =
      cart.items?.map((item: IOrderItem) => ({
        item_id: item.id,
        item_name: item.product?.title ?? 'Rental',
        price: item.rent,
        quantity: Number(item.qty ?? 1),
      })) ?? []
    try {
      trackPurchaseEvent({
        transaction_id: orderId,
        value: cart.total_amount,
        currency: 'INR',
        items,
        rental_days: cart.days || 0,
        total_rent: cart.amount,
      })
    } catch {
      /* analytics is best-effort */
    }
    setFinalOrderId(orderId)
    dispatch(setCart(null))
    setStep(5)
  }, [cart, dispatch])

  const startPayment = useCallback(
    async (method: PaymentMethod) => {
      if (!cart) return
      const {start, end} = parseDates(storeSearch?.dates)
      const days = daysBetween(start, end)
      const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      await displayRazorpay(cart.id, trackAndFinish, {
        method,
        prefill: {
          name:
            [loggedUser?.firstname, loggedUser?.lastname]
              .filter(Boolean)
              .join(' ') || undefined,
          email: loggedUser?.email_address || undefined,
          contact: loggedUser?.phone || undefined,
        },
        notes: {
          order_id: cart.id,
          rental_start: fmt(start),
          rental_end: fmt(end),
          rental_days: days,
          fulfillment: mode,
          delivery_timing: mode === 'delivery' ? timing : 'n/a',
          items_count: cart.items?.length ?? 0,
          city: cart.delivery_address?.city ?? loggedUser?.city,
        },
      })
    },
    [cart, trackAndFinish, loggedUser, storeSearch, mode, timing],
  )

  const rental = cart ? Number(cart.amount || 0) : 0
  const breakdown = buildBreakdown(rental, mode, timing)

  return (
    <MobileChrome hideTabBar bottomPad="none">
      <div className="lg:max-w-2xl lg:mx-auto">
      <Stepper
        step={displayStep}
        total={totalSteps}
        title={TITLES[step]}
        onBack={goBack}
      />

      {step === 1 && (
        <CartStep
          cart={cart}
          loading={cartLoading}
          onContinue={() => setStep(2)}
          onEditDates={() => setDatesOpen(true)}
        />
      )}

      {step === 2 && (
        <AddressStep
          addresses={addresses}
          loading={addressesLoading}
          selectedId={selectedAddressId}
          onSelect={selectAddress}
          onContinue={advanceFromAddress}
          onAddressAdded={handleAddressAdded}
          mode={mode}
          onModeChange={setMode}
          deliveryFee={DELIVERY_BASE_FEE}
        />
      )}

      {step === 3 && mode === 'delivery' && (
        <DeliveryStep
          selected={timing}
          onSelect={setTiming}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <PaymentStep breakdown={breakdown} onPay={startPayment} />
      )}

      {step === 5 && finalOrderId !== null && (
        <DoneStep orderId={finalOrderId} />
      )}
      </div>

      <DatePickerSheet
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
      />
    </MobileChrome>
  )
}
