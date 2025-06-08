import {IProduct} from '../../app-store/types'
import httpClient from './../axios.config'

export async function getProducts(): Promise<IProduct[]> {
  const response: IProduct[] = await httpClient.get(`/user/products`)
  return response
}

export async function getProductsByAddress(
  addressId: number,
): Promise<IProduct[]> {
  const response: IProduct[] = await httpClient.get(
    `/user/products?addressId=${addressId}`,
  )
  return response
}
