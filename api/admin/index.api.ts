import { IBrand, IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchBrands(): Promise<IBrand[]> {
    try {
        const brands: IBrand[] = await httpClient.get(`/admin/brands`);
        return brands;

    } catch (e) {
        throw e;
    }
}

export async function fetchDeliveryReps(): Promise<IUser[]> {
    try {
        const reps: IUser[] = await httpClient.get(`/admin/users?role=D`);
        return reps;

    } catch (e) {
        throw e;
    }
}
