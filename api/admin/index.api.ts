import { IBrand } from '../../app-store/types';
import httpClient from './../axios.config';

export async function fetchBrands(): Promise<IBrand[]> {
    try {
        const brands: IBrand[] = await httpClient.get(`/admin/brands`);
        return brands;

    } catch (e) {
        throw e;
    }
}
