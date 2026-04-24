'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from '../../../../app-store/user/orders/orders.slice'
import {fetchCart} from '../../../../api/user/orders.api'
import {fetchAddresses} from '../../../../api/user/index.api'
import {displayRazorpay} from '../../../../util/razorpay.util'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {setLastLink} from '../../../../app-store/session/session.slice'
import {ILocation, IOrder, IOrderItem} from '../../../../app-store/types'
import {
  PurchaseItem,
  trackPurchaseEvent,
} from '../../../../utils/analytics'

import MobileChrome from '../MobileChrome'
import DatePickerSheet from '../product/DatePickerSheet'
import Stepper from './Stepper'
import CartStep from './CartStep'
import AddressStep from './AddressStep'
import DeliveryStep, {DeliveryOption} from './DeliveryStep'
import PaymentStep from './PaymentStep'
import DoneStep from './DoneStep'
import type {PaymentMethod} from '../../../../util/razorpay.util'

type Step = 1 | 2 | 3 | 4 | 5

const TITLES: Record<Step, string> = {
  1: 'Your cart',
  2: 'Pick an address',
  3: 'Delivery option',
  4: 'Payment',
  5: 'All done',
}

const DELIVERY_FEES: Record<DeliveryOption, number> = {
  'same-day': 99,
  scheduled: 149,
  pickup: 0,
}

export default function CartCheckoutScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector(getCart) as IOrder | null | undefined
  const loggedUser = useSelector(selectAuthState)

  const [step, setStep] = useState<Step>(1)
  const [cartLoading, setCartLoading] = useState(true)
  const [addresses, setAddresses] = useState<ILocation[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  )
  const [delivery, setDelivery] = useState<DeliveryOption>('same-day')
  const [datesOpen, setDatesOpen] = useState(false)
  const [finalOrderId, setFinalOrderId] = useState<number | null>(null)

  useEffect(() => {
    if (!loggedUser) {
      dispatch(setLastLink('/p/mycart'))
      router.push('/join')
      return
    }
    setCartLoading(true)
    setAddressesLoading(true)
    fetchCart()
      .then(data => dispatch(setCart(data)))
      .catch(() => {})
      .finally(() => setCartLoading(false))
    fetchAddresses()
      .then(list => setAddresses(list ?? []))
      .catch(() => setAddresses([]))
      .finally(() => setAddressesLoading(false))
  }, [loggedUser, dispatch, router])

  const goBack = useCallback(() => {
    if (step === 1) {
      router.push('/')
      return
    }
    setStep(s => (Math.max(1, s - 1) as Step))
  }, [step, router])

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

  const trackAndFinish = useCallback(() => {
    if (!cart) return
    const orderId = cart.id
    const items: PurchaseItem[] =
      cart.items?.map((item: IOrderItem) => ({
        item_id: item.id,
        item_name: item.product?.title ?? 'Rental',
        price: item.rent,
        quantity: cart.days || 0,
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
      })
    },
    [cart, trackAndFinish, loggedUser],
  )

  const totalPayable =
    (cart ? Number(cart.amount || 0) : 0) +
    (step >= 3 ? DELIVERY_FEES[delivery] : Number(cart?.delivery_fee ?? 99))

  return (
    <MobileChrome hideTabBar bottomPad="none">
      <div className="lg:max-w-2xl lg:mx-auto">
      <Stepper
        step={step}
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
          onContinue={() => setStep(3)}
          onAddNew={() => router.push('/p/profile?section=addresses')}
        />
      )}

      {step === 3 && (
        <DeliveryStep
          selected={delivery}
          onSelect={setDelivery}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <PaymentStep totalPayable={totalPayable} onPay={startPayment} />
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
