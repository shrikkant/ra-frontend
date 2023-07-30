import { IOrder } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchOrders(): Promise<IOrder[]> {
    try {
        const orders: IOrder[] = await httpClient.get(`/user/orders`);

        return orders;

    } catch (e) {
        throw e;
    }
}

export async function fetchCart(): Promise<IOrder> {
    try {
        const response: IOrder[] = await httpClient.get(`/user/orders?status=0`);

        return response && response[0];
    } catch (e) {
        throw e;
    }
}

