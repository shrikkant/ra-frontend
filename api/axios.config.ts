/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { TOKEN_COOKIE_KEY, TOKEN_HEADER_KEY } from '../config/constants';
import { displayMessage } from '../util/global.util';

export const getToken = async () => Cookies.get(TOKEN_COOKIE_KEY);

export class HttpService {
    private url: string;
    private client: AxiosInstance;

    constructor(url: string) {
        this.client = axios.create({
            baseURL: url
        });

        this.client.interceptors.request.use(
            async (config: any) => {
                config.rejectUnauthorized = true;

                if (!config.headers?.[TOKEN_HEADER_KEY]) {
                    const token = await getToken();
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

        this.client.interceptors.response.use(
            async function (res: AxiosResponse<any>) {
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

    }

    getClient(): AxiosInstance {
        return this.client;
    }

}
const httpClient = axios.create({
    baseURL: "https://www.rentacross.com/api/"
});


httpClient.interceptors.request.use(
    async (config: any) => {
        const token = await getToken();
        config.rejectUnauthorized = true;
        console.log("Token: ", token);
        if (!config.headers?.[TOKEN_HEADER_KEY]) {

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
    async function (res: AxiosResponse<any>) {
        const response: any = res;
        const { resultFormatted } = response.data;
        if (response.data?.successMessage) {
            displayMessage('success', response.data?.successMessage);
        } else if (response.data?.errorMessage) {
            displayMessage('error', response.data?.errorMessage);
        }
        return resultFormatted;
    }, (error) => {
        if (error.status === 403) {
            if (window.location.href.indexOf('signUp=true') === -1) {
                window.location.href = '/?signUp=true';
            }
        }
        return;
    }
)

export const fetchData = async (url, customOptions?) => {

    const commonOptions = {
        headers: { 'Content-Type': 'application/json' },
        referrer: 'https://www.rentacross.com'
    }

    const options = {
        ...commonOptions,
        ...customOptions
    }


    const response: any = await fetch(`https://www.rentacross.com/api/${url}`, options);

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    const { resultFormatted } = await response.json();

    return resultFormatted;
}

export default httpClient;
