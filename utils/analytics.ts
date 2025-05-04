export const trackGAEvent = (
  event: string,
  props: Record<string, string | number | boolean> = {},
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
  CHECKOUT_START: 'checkout_start',
  PURCHASE: 'purchase',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  SEARCH: 'search',
  FILTER: 'filter',
  SHARE: 'share',
  DOWNLOAD: 'download',
  VIDEO_PLAY: 'video_play',
  ERROR: 'error',
} as const
