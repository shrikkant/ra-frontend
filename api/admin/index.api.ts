import {IBrand, IMasterProduct, IProduct, IUser} from '../../app-store/types'
import httpClient from './../axios.config'

export async function fetchBrands(): Promise<IBrand[]> {
  const brands: IBrand[] = await httpClient.get(`/admin/brands`)
  return brands
}

export async function fetchDeliveryReps(): Promise<IUser[]> {
  const reps: IUser[] = await httpClient.get(`/admin/users?role=D`)
  return reps
}

export async function fetchMasterProducts(
  query: string,
  pageNumber: number,
  pageLimit: number,
): Promise<IMasterProduct[]> {
  const products: IMasterProduct[] = await httpClient.get(
    `/admin/inventory?query=${query}&pageNumber=${pageNumber}&pageLimit=${pageLimit}`,
  )
  return products
}
export async function fetchMasterProduct(id: number): Promise<IMasterProduct> {
  const product: IMasterProduct = await httpClient.get(`/admin/inventory/${id}`)
  return product
}

export const fetchRevenueStats = async () => {
  const response = await httpClient.get(`/admin/revenue`)
  return response
}

export const fetchSignupStats = async () => {
  const response = await httpClient.get(`/admin/users/stats`)
  return response
}

export interface DailySignupPoint {
  date: string
  signups: number
  add_to_cart: number
}

export interface DailySignupStatsResponse {
  series: DailySignupPoint[]
  cities: string[]
}

export const fetchDailySignupStats = async (
  city?: string,
): Promise<DailySignupStatsResponse> => {
  const qs = city ? `?city=${encodeURIComponent(city)}` : ''
  const response: DailySignupStatsResponse = await httpClient.get(
    `/admin/users/daily-stats${qs}`,
  )
  return response
}

export interface MasterProductConversionRow {
  master_product_id: number
  master_product_name: string | null
  add_to_cart: number
  signups: number
  engaged: number
  conversion: number
}

export interface ProductConversionRow {
  product_id: number
  product_title: string | null
  product_rate: number | null
  add_to_cart: number
  signups: number
  engaged: number
  conversion: number
}

export interface MasterProductConversionResponse {
  year: number
  month: number
  rows: MasterProductConversionRow[]
}

export interface ProductConversionResponse {
  year: number
  month: number
  masterProductId: number
  rows: ProductConversionRow[]
}

export const fetchMasterProductConversionStats = async (
  year: number,
  month: number,
): Promise<MasterProductConversionResponse> => {
  const response: MasterProductConversionResponse = await httpClient.get(
    `/admin/products/conversion-stats?year=${year}&month=${month}`,
  )
  return response
}

export const fetchProductConversionStatsForMaster = async (
  masterProductId: number,
  year: number,
  month: number,
): Promise<ProductConversionResponse> => {
  const response: ProductConversionResponse = await httpClient.get(
    `/admin/products/conversion-stats/${masterProductId}?year=${year}&month=${month}`,
  )
  return response
}

export async function createMasterProductLink(
  data: {
    product_id: number
    master_product_id: number
  }[],
): Promise<any> {
  const response = await httpClient.post('/admin/addons', data)
  return response
}

export async function fetchProductInventory(
  userId: number,
  addressId: number,
  pageNumber: number = 0,
  pageLimit: number = 50,
): Promise<any[]> {
  const inventory = await httpClient.get(
    `/v1/users/${userId}/address/${addressId}/inventory?pageNumber=${pageNumber}&pageLimit=${pageLimit}`,
  )
  return inventory
}

export const createProductInventory = async (
  userId: number,
  addressId: number,
  data: any,
) => {
  const response = await httpClient.post(
    `/v1/users/${userId}/address/${addressId}/inventory`,
    data,
  )

  return response
}

export const updateProductInventory = async (
  userId: number,
  addressId: number,
  id: number,
  data: any,
) => {
  const response = await httpClient.patch(
    `/v1/users/${userId}/address/${addressId}/inventory/${id}`,
    data,
  )

  return response
}

export const syncProductWithAI = async (productId: number): Promise<any> => {
  const response = await httpClient.put(`/v1/products/${productId}/ai-sync`)
  console.log('Sync Product with AI Response : ', response)
  return response
}

export const getAISyncStatus = async (): Promise<{
  synced: number
  toSync: number
}> => {
  const response = await httpClient.get(`/v1/products/ai-sync/stats`)
  return response
}

export const syncNextProducts = async (count: number = 10): Promise<any> => {
  const response = await httpClient.post(`/v1/products/ai-sync`, {
    count,
  })
  return response
}

export const adminListNewProduct = async (
  userId: number,
  masterProduct: IMasterProduct,
  rate: number,
  addressId: number,
): Promise<IProduct> => {
  const rates = [{rate, duration: 'D'}]
  const newProduct = {
    address_id: addressId,
    master_product_id: masterProduct.id,
    title: masterProduct.name,
    category_id: masterProduct.category_id,
    sub_category_id: masterProduct.sub_category_id,
    qty: 1,
    rates,
  }
  const response: IProduct = await httpClient.post(
    `/admin/users/${userId}/products`,
    newProduct,
  )
  return response
}
