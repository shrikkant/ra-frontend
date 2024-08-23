import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';


import { TOKEN_COOKIE_KEY, TOKEN_HEADER_KEY } from '../config/constants';
import { displayMessage } from '../util/global.util';

export const getToken = async () => Cookies.get(TOKEN_COOKIE_KEY);

const httpClient = axios.create({
    baseURL: "https://www.rentacross.com/api/"
});


httpClient.interceptors.request.use(
    async (config: any) => {
        config.rejectUnauthorized = true;

        if (!config.headers?.[TOKEN_HEADER_KEY]) {
            const token = await getToken();
            config.headers = {
                TOKEN_HEADER_KEY: token || '',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                ...config.headers
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
    }
)

export const fetchData = async (url, customOptions?) => {

    const commonOptions = {
        headers: { 'Content-Type': 'application/json' },
        referrer: 'https://labs.rentacross.com'
    }

    const options = {
        ...commonOptions,
        ...customOptions
    }


    const response: any = await fetch(`http://localhost:8082/api/${url}`, options);

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    const { resultFormatted } = await response.json();

    return resultFormatted;
}

export default httpClient;
