import {IProduct, IProductRatePlan} from '../../app-store/types'

// Product component props
export interface ProductProps {
  product: IProduct
}

// Product details section props
export interface ProductDetailsSectionProps {
  product: IProduct
  addons: any // TODO: Replace with proper type when available
}

// Booking form section props
export interface BookingFormSectionProps {
  productId: number
  discount: number
  rate?: number | null // Primary rate (preferred)
  rates?: IProductRatePlan[] // @deprecated - kept for backward compatibility
}

// Addon type (if not already defined in app-store types)
export interface Addon {
  masterProduct: {
    id: number
    photos: Array<{path: string}>
    name: string
  }
}
