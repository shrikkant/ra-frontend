import { IBrand, IMasterProduct, IUser } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchBrands(): Promise<IBrand[]> {
    const brands: IBrand[] = await httpClient.get(`/admin/brands`);
    return brands;
}

export async function fetchDeliveryReps(): Promise<IUser[]> {

    const reps: IUser[] = await httpClient.get(`/admin/users?role=D`);
    return reps;
}

export async function fetchMasterProducts(
    pageNumber,
    pageLimit): Promise<IMasterProduct[]> {

    const products: IMasterProduct[] = await httpClient.get(`/admin/inventory?&pageNumber=${pageNumber}&pageLimit=${pageLimit}`);
    return products;
}

export const fetchRevenueStats = async () => {
    const response = await httpClient.get(`/admin/revenue`);
    return response;
}

export const fetchSignupStats = async () => {
    const response = await httpClient.get(`/admin/users/stats`);
    return response;
}

