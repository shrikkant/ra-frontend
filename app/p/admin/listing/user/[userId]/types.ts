export interface Address {
  id: number
  city: string
  state: string
  landmark: string
  display: string
  is_verified: boolean
}

export interface City {
  city: string
  addresses: Address[]
}

export interface Product {
  id: number
  title: string
  rate: number | null
  status: number
  featured: number
  masterProductId: number | null
  masterProductName: string | null
  addressLinks: Record<number, {linkId: number; isActive: boolean}>
}

export interface MatrixData {
  userId: number
  cities: City[]
  products: Product[]
  totalProducts: number
  totalCities: number
}

export const STATUS_LABELS: Record<number, {label: string; color: string}> = {
  0: {label: 'Pending', color: 'bg-yellow-100 text-yellow-800'},
  1: {label: 'Active', color: 'bg-green-100 text-green-800'},
  2: {label: 'Draft', color: 'bg-gray-100 text-gray-800'},
  3: {label: 'Disabled', color: 'bg-red-100 text-red-800'},
  4: {label: 'Rejected', color: 'bg-red-100 text-red-800'},
}
