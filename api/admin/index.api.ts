import {IBrand, IMasterProduct, IUser} from '../../app-store/types'
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

export async function createMasterProductLink(
  data: {
    product_id: number
    master_product_id: number
  }[],
): Promise<any> {
  const response = await httpClient.post('/admin/addons', data)
  return response
}
