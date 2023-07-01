import httpClient from './axios.config';

export async function getAuthUser(): Promise<any> {
    try {
        const response : any = await httpClient.get(`auth`);
        return response.user;
    } catch (e) {
        throw e;
    }
}
