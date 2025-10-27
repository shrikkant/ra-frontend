// Recursive type to support JSON-serializable values for GA events
type GAEventValue =
  | string
  | number
  | boolean
  | null
  | object[]
  | {[key: string]: GAEventValue}

export const trackGAEvent = (
  event: string,
  props: Record<string, GAEventValue> = {},
) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event,
      ...props,
    })
  }
}

// Common event types
export const GA_EVENTS = {
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  PAGE_VIEW: 'page_view',
  ADD_TO_CART: 'conversion_event_add_to_cart',
  PURCHASE: 'conversion_event_purchase',
  CHECKOUT_START: 'checkout_start',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  SEARCH: 'search',
  FILTER: 'filter',
  SHARE: 'share',
  DOWNLOAD: 'download',
  VIDEO_PLAY: 'video_play',
  ERROR: 'error',
} as const

// Purchase event types
export interface PurchaseItem {
  item_id: number | string
  item_name: string
  price: number
  quantity: number
}

export interface PurchaseEventData {
  transaction_id: number | string
  value: number
  currency?: string
  items: PurchaseItem[]
  rental_days?: number
  total_rent?: number
}

export const trackPurchaseEvent = (data: PurchaseEventData) => {
  const eventData: Record<string, GAEventValue> = {
    transaction_id: data.transaction_id,
    value: data.value,
    currency: data.currency || 'INR',
    items: data.items,
  }

  if (data.rental_days !== undefined) {
    eventData.rental_days = data.rental_days
  }

  if (data.total_rent !== undefined) {
    eventData.total_rent = data.total_rent
  }

  trackGAEvent(GA_EVENTS.PURCHASE, eventData)
}
