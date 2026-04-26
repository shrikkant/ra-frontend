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
  /**
   * Searchable, indexed metadata sent to the Razorpay dashboard. Use for
   * order context (rental window, delivery type, item count) — anything
   * ops or analytics might want to filter by later.
   */
  notes?: Record<string, string | number | boolean | undefined | null>
  /** Override the modal accent. Defaults to the redesign brand yellow. */
  themeColor?: string
}

const DEFAULT_THEME_COLOR = '#F5C518'

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

/**
 * Strips undefined/null values so we don't send empty keys to the
 * Razorpay dashboard.
 */
function cleanNotes(
  notes?: DisplayRazorpayOptions['notes'],
): Record<string, string> | undefined {
  if (!notes) return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(notes)) {
    if (v === undefined || v === null || v === '') continue
    out[k] = String(v)
  }
  return Object.keys(out).length ? out : undefined
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
  const notes = cleanNotes({
    ...(result.clientConfig.notes ?? {}),
    ...(options.notes ?? {}),
  })

  const config = {
    ...result.clientConfig,
    handler,
    ...(methodConfig ? {method: methodConfig} : {}),
    ...(notes ? {notes} : {}),
    prefill: {
      ...(result.clientConfig.prefill ?? {}),
      ...(options.prefill ?? {}),
    },
    theme: {
      ...(result.clientConfig.theme ?? {}),
      color: options.themeColor ?? DEFAULT_THEME_COLOR,
    },
  }

  new (window as any).Razorpay(config).open()
}
