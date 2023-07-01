import { IProduct } from '../../app-store/types';
import httpClient from './../axios.config';

export async function getProducts(): Promise<IProduct[]> {
    try {
        const response: IProduct[] = await httpClient.get(`/user/products`);

        return response;
    } catch (e) {
        throw e;
    }
}
