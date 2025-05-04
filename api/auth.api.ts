/* eslint-disable @typescript-eslint/no-explicit-any */
import {IUser} from '../app-store/types'
import httpClient from './axios.config'

export async function getAuthUser(): Promise<IUser> {
  const response: any = await httpClient.get(`auth`)
  return response?.user
}

export const getAdminAuthUser = async (customerId: number) => {
  const response: IUser = await httpClient.get(
    `admin/users/login/${customerId}`,
  )
  return response
}

export async function logoutUser(): Promise<IUser> {
  const response: any = await httpClient.get(`auth/logout`)
  return response
}
