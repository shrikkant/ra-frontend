import { IOrder, IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchCustomers(): Promise<IUser[]> {
    try {
        const customers: IUser[] = await httpClient.get(`/admin/users`);
        return customers;

    } catch (e) {
        throw e;
    }
}

export async function fetchActiveCustomer(id: number): Promise<IUser> {
    try {
        const customer: IUser = await httpClient.get(`/admin/users/${id}`);
        console.log("active customer : ", id);
        return customer;

    } catch (e) {
        throw e;
    }
}
