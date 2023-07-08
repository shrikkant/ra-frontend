import { IOrder, IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchOrders(status: number): Promise<IOrder[]> {
    const orderStatus = status;
    try {
        const orders: IOrder[] = await httpClient.get(`/admin/orders?status=${orderStatus}&offset=0`);
        return orders;

    } catch (e) {
        throw e;
    }
}

export async function fetchOrder(id: number): Promise<IOrder> {
    try {
        const order: IOrder = await httpClient.get(`/admin/orders/${id}`);
        return order;
    } catch (e) {
        throw e;
    }
}



