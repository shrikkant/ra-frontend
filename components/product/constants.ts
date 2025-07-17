// Layout configuration constants
export const PRODUCT_LAYOUT = {
  PRODUCT_DETAILS_WIDTH: 'w-full md:w-2/3',
  BOOKING_FORM_WIDTH: 'w-full md:w-1/3',
  CONTAINER_MAX_WIDTH: 'max-w-7xl',
  GAP: 'gap-8 md:gap-12',
} as const

// Styling constants
export const CARD_STYLES = {
  PRODUCT_CARD:
    'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
  BOOKING_CARD:
    'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
  SECTION_CARD: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
} as const

// Reviews section configuration
export const REVIEWS_CONFIG = {
  title: 'Customer Reviews',
  subtitle: 'See what others are saying about our equipment',
  variant: 'compact' as const,
  maxReviews: 3,
  showCTA: false,
  className: 'bg-white border-t border-gray-100',
} as const
