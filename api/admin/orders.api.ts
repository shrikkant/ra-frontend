import {IDelivery, IOrder} from '../../app-store/types'
import httpClient, {HttpService} from './../axios.config'

export async function fetchOrders(status: number): Promise<IOrder[]> {
  const orderStatus = status

  const orders: IOrder[] = await httpClient.get(
    `/admin/orders?status=${orderStatus}&offset=0`,
  )
  return orders
}

export async function fetchOrder(id: number): Promise<IOrder> {
  const order: IOrder = await httpClient.get(`/admin/orders/${id}`)
  return order
}

export async function updateStage(id: number, stageInfo): Promise<IOrder> {
  const response: IOrder = await httpClient.put(
    `/admin/orders/${id}`,
    stageInfo,
  )
  return response && response[0]
}

export async function applyDiscount(
  id: number,
  transactionId: number,
  discountInfo,
): Promise<IOrder> {
  const response: IOrder = await httpClient.put(
    `/admin/orders/${id}/transactions/${transactionId}/applyDiscount`,
    discountInfo,
  )
  return response
}

export async function assignDeliveryRep(
  deliveryAssignment,
): Promise<IDelivery> {
  const response: IDelivery = await httpClient.post(
    `/admin/delivery/`,
    deliveryAssignment,
  )
  return response
}

export async function fetchOrderDelivery(
  deliveryId: number,
): Promise<IDelivery> {
  const response: IDelivery = await httpClient.get(
    `/admin/delivery/${deliveryId}`,
  )
  return response
}

export const getSignedRentalAgreementForAdmin = async (
  userId: number,
  orderId: number,
): Promise<{success: boolean; data: string}> => {
  const httpService = new HttpService('/api/v1')
  const response = await httpService
    .getClient()
    .get(`/admin/users/${userId}/orders/${orderId}/rental-agreement/signed`)
  return response
}
