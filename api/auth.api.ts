import httpClient from './axios.config';

export async function getAuthUser(): Promise<any> {

    const response: any = await httpClient.get(`auth`);
    return response?.user;

}
