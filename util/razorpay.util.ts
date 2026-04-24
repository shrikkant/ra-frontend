/* eslint-disable @typescript-eslint/no-explicit-any */
import {createRazorPayOrder, processPayment} from '../api/user/orders.api'

/** Payment methods we surface in the redesigned checkout. */
export type PaymentMethod = 'upi' | 'card' | 'netbanking'

export interface RazorpayPrefill {
  name?: string
  email?: string
  contact?: string
}

export interface DisplayRazorpayOptions {
  /**
   * Restricts the Razorpay modal to a single payment method so the user
   * lands directly on the pane they picked in our checkout. If omitted,
   * Razorpay shows its full method picker.
   */
  method?: PaymentMethod
  /** User details to prefill (so the user doesn't retype name/phone/email). */
  prefill?: RazorpayPrefill
}

/**
 * Loads Razorpay Checkout once and caches the promise so repeated calls
 * don't re-inject the script tag.
 */
let scriptPromise: Promise<boolean> | null = null
function loadCheckoutScript(): Promise<boolean> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise(resolve => {
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => {
      scriptPromise = null
      resolve(false)
    }
    document.body.appendChild(script)
  })
  return scriptPromise
}

/**
 * Builds the `method` config Razorpay expects when restricting which
 * payment options appear. `true` shows the method, `false` hides it.
 */
function buildMethodConfig(method?: PaymentMethod) {
  if (!method) return undefined
  return {
    upi: method === 'upi',
    card: method === 'card',
    netbanking: method === 'netbanking',
    wallet: false,
    paylater: false,
    emi: false,
  }
}

export const displayRazorpay = async (
  orderId: number,
  success: (paymentResponse: any) => void,
  options: DisplayRazorpayOptions = {},
) => {
  const loaded = await loadCheckoutScript()
  if (!loaded) {
    alert('Razorpay SDK failed to load. Are you online?')
    return
  }

  const result: any = await createRazorPayOrder({orderId})
  if (!result?.clientConfig) {
    alert('Server error. Are you online?')
    return
  }

  const handler = result.isTestMode
    ? (paymentResponse: any) => {
        processPayment(paymentResponse).then(success)
      }
    : success

  const methodConfig = buildMethodConfig(options.method)

  const config = {
    ...result.clientConfig,
    handler,
    ...(methodConfig ? {method: methodConfig} : {}),
    prefill: {
      ...(result.clientConfig.prefill ?? {}),
      ...(options.prefill ?? {}),
    },
  }

  new (window as any).Razorpay(config).open()
}
