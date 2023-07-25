import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';


import { BASE_API_URL, TOKEN_COOKIE_KEY, TOKEN_HEADER_KEY } from '../config/constants';
import { displayMessage } from '../util/global.util';

export const getToken = async () => Cookies.get(TOKEN_COOKIE_KEY);

const httpClient = axios.create({
    baseURL:BASE_API_URL
});


httpClient.interceptors.request.use(
    async (config: any) => {
        config.rejectUnauthorized = true;

        if (!config.headers?.[TOKEN_HEADER_KEY]) {
            let token = await getToken();
            config.headers = {
                TOKEN_HEADER_KEY: token || '',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                ...config.headers,
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

httpClient.interceptors.response.use(
    async function (res:AxiosResponse<any>) {
        const response: any = res;

        const { resultFormatted } = response.data;

        // console.log("Response Message: ", response.data);
        if (response.data?.successMessage) {
            displayMessage('success', response.data?.successMessage);
        } else if (response.data?.errorMessage) {
            displayMessage('error', response.data?.errorMessage);
        }
        return resultFormatted;
    }
)

export default httpClient;
