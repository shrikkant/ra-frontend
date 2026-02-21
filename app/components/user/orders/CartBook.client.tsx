'use client'
import OrderSummary from 'components/OrderSummary'
import {OrderItemsReview} from 'components/order/OrderItemsReview'
import {AddressPicker} from 'components/order/AddressPicker'
import {StepProgressBar} from 'components/order/StepProgressBar'
import {StickyMobileCta} from 'components/order/StickyMobileCta'
import {CheckoutSkeleton} from 'components/order/CheckoutSkeleton'
import Loader from 'components/Loader'
import {useCheckoutFlow} from '../../../../hooks/useCheckoutFlow'

export default function CartBook() {
  const {
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
  } = useCheckoutFlow()

  if (loading) return <CheckoutSkeleton />

  if (!cart) return <Loader />

  return (
    <div
      className={`max-w-6xl mx-auto md:px-6 pt-2 ${showStickyCta ? 'pb-20' : 'pb-4'} md:pb-4`}
    >
      <StepProgressBar currentStep={currentStep} />

      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Main content */}
        <div className="md:w-2/3 w-full">
          <div className="border border-gray-300 rounded-md p-3 md:p-4 flex flex-col gap-y-3 transition-all duration-300 ease-in-out">
            <OrderItemsReview title="Your Items" order={cart} />
            <div id="address-section">
              <AddressPicker
                onAddressPick={selectAddress}
                onAddressReset={resetAddress}
                selectedAddress={selectedAddress}
                addresses={addresses}
                addressesLoaded={addressesLoaded}
                onNewAddress={handleNewAddress}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3 w-full">
          <div className="md:sticky md:top-24 w-full">
            <OrderSummary
              order={cart}
              step={currentStep}
              isLoading={isPaymentLoading}
              onCallToAction={handleCtaClick}
              hideMobileCta
            />
          </div>
        </div>
      </div>

      {showStickyCta && (
        <StickyMobileCta
          currentStep={currentStep}
          totalAmount={totalAmount}
          isLoading={isPaymentLoading}
          onCtaClick={handleCtaClick}
        />
      )}
    </div>
  )
}
