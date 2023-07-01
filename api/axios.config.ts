import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';


import { BASE_API_URL, TOKEN_COOKIE_KEY, TOKEN_HEADER_KEY } from '../config/constants';

export const getToken = async () => Cookies.get(TOKEN_COOKIE_KEY);

const httpClient = axios.create({
    baseURL:BASE_API_URL
});


httpClient.interceptors.request.use(
    async (config: any) => {
        console.log(" Base APP URL : ", BASE_API_URL);
        config.rejectUnauthorized = true;

        if (!config.headers?.[TOKEN_HEADER_KEY]) {
            let token = await getToken();
            console.log("Token : ", token);
            config.headers = {
                ...config.headers,
                TOKEN_HEADER_KEY: token || '',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

httpClient.interceptors.response.use(
    async function (response:AxiosResponse<any>) {
        const { resultFormatted } = response.data;

        return resultFormatted;
    }
)

export default httpClient;
