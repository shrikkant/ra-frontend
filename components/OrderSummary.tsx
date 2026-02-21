import {ORDER_STEPS} from '../config/constants'
import {IOrder} from '../app-store/types'
import Button from './common/form/Button'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../app-store/auth/auth.slice'
import {EarlyDeliveryBanner} from './order/EarlyDeliveryBanner'
import {RentalPeriodCard} from './order/RentalPeriodCard'
import {PriceBreakdown} from './order/PriceBreakdown'
import {TrustIndicators} from './order/TrustIndicators'

function getCtaLabel(step: number, isLoggedIn: boolean): string | undefined {
  switch (step) {
    case ORDER_STEPS.ORDER_STEP_CART:
      return isLoggedIn ? 'Proceed to Book' : 'Sign in to Book'
    case ORDER_STEPS.ORDER_STEP_ADDRESS:
      return 'Add Address'
    case ORDER_STEPS.ORDER_STEP_DELIVERY:
      return 'Select Address'
    case ORDER_STEPS.ORDER_STEP_PAYMENT:
      return 'Place Your Order'
    case ORDER_STEPS.ORDER_PAID:
      return 'Order Placed'
  }
}

export default function OrderSummary({
  order,
  step,
  isLoading,
  onCallToAction,
  hideMobileCta = false,
}: {
  order: IOrder
  step: number
  showCallToAction?: boolean
  isLoading?: boolean
  onCallToAction: (mode: number) => void
  hideMobileCta?: boolean
}) {
  const loggedUser = useSelector(selectAuthState)

  const discount = Number(order.applied_discount) || 0
  const totalRent = (Number(order.amount) || 0) + discount
  const deliveryFee = Number(order.delivery_fee) || 0
  const totalAmount = totalRent + deliveryFee - discount
  const days = Number(order.days) || 0
  const discountPercent = totalRent > 0 ? Math.round((discount / totalRent) * 100) : 0

  const ctaLabel = getCtaLabel(step, !!loggedUser)

  return (
    <div className="p-4 bg-white border border-amber-400 shadow-lg rounded-md min-w-[276px]">
      <div className="text-center text-2xl font-bold border-b border-gray-200 pb-2">
        Order Summary
      </div>

      {order.start_date && <EarlyDeliveryBanner startDate={order.start_date!} />}

      <RentalPeriodCard
        startDate={order.start_date}
        endDate={order.end_date}
        days={days}
      />

      <PriceBreakdown
        days={days}
        totalRent={totalRent}
        discountedRent={Number(order.amount) || 0}
        discount={discount}
        discountPercent={discountPercent}
        deliveryFee={deliveryFee}
        totalAmount={totalAmount}
      />

      {step !== ORDER_STEPS.ORDER_PAID && <TrustIndicators />}

      <div className={hideMobileCta ? 'hidden md:block' : ''}>
        {step !== ORDER_STEPS.ORDER_PAID && ctaLabel && (
          <div className="sticky md:relative bottom-0 left-0 py-4 px-0 md:p-0 w-full md:shadow-none mt-4 z-50 border-t border-t-gray-300">
            <Button
              isLoading={isLoading}
              variant="primary"
              onClick={() => onCallToAction(step)}
              label={ctaLabel}
            />
          </div>
        )}
      </div>
    </div>
  )
}
