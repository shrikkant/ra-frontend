import { IOrder } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchOrders(status: number): Promise<IOrder[]> {
    const orderStatus = status;

    const orders: IOrder[] = await httpClient.get(`/admin/orders?status=${orderStatus}&offset=0`);
    return orders;


}

export async function fetchOrder(id: number): Promise<IOrder> {
    const order: IOrder = await httpClient.get(`/admin/orders/${id}`);
    return order;
}

export async function updateStage(id: number, stageInfo): Promise<IOrder> {
    const response: IOrder = await httpClient.put(`/admin/orders/${id}`, stageInfo);
    return response && response[0];
}

export async function applyDiscount(id: number, transactionId: number, discountInfo): Promise<IOrder> {
    const response: IOrder = await httpClient.put(`/admin/orders/${id}/transactions/${transactionId}/applyDiscount`, discountInfo);
    return response
}

export async function assignDeliveryRep(deliveryAssignment): Promise<IOrder> {
    const response: IOrder = await httpClient.post(`/admin/delivery/`, deliveryAssignment);
    return response
}



