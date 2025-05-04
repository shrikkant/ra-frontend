import {IDates} from '../../app-store/app-defaults/types'
import {IOrder, ITransaction} from '../../app-store/types'
import httpClient from './../axios.config'
import Moment from 'moment'

interface Dates {
  startDate: Date
  endDate: Date
}

export async function fetchOrders(): Promise<IOrder[]> {
  const orders: IOrder[] = await httpClient.get(`/user/orders`)
  return orders
}

export async function fetchCart(): Promise<IOrder> {
  const response: IOrder[] = await httpClient.get(`/user/orders?status=0`)
  return response && response[0]
}

export async function fetchOrder(orderId: number): Promise<IOrder> {
  const response: IOrder = await httpClient.get(`/user/orders/${orderId}`)
  return response
}

export const addToCart = async (
  productId: number,
  dates: IDates,
): Promise<IOrder> => {
  const {startDate, endDate} = dates

  const START_HOUR = 9 // 9 AM
  const END_HOUR = 19 // 7 PM
  const order: IOrder = await httpClient.post(`/user/carts`, {
    date: {
      startDate: Moment(new Date(startDate)).format('YYYY-MM-DD'),
      endDate: Moment(new Date(endDate)).format('YYYY-MM-DD'),
      startTime: START_HOUR,
      endTime: END_HOUR,
      rentalDays: 1,
    },
    product_id: productId,
  })
  return order
}

export const removeFromCart = async (productId: number) => {
  await httpClient.delete(`/user/carts/` + productId)
}

export const processPayment = async paymentResponse => {
  // dev instance hack. not to be used in production.
  const response = await httpClient.post(
    `/user/payment/process`,
    paymentResponse,
  )
  return response
}

export const createRazorPayOrder = async razorPayOrderDetails => {
  const response = await httpClient.post(
    '/user/payment/razorPayOrder',
    razorPayOrderDetails,
  )
  return response
}

export const updateDeliveryAddress = async (orderId, address) => {
  const response: IOrder = await httpClient.put(
    '/user/orders/' + orderId + '?mode=1',
    address,
  )

  return response
}
