import getConfig from 'next/config';

const { publicRuntimeConfig: envConfig } = getConfig()

export const ENV = process.env.REACT_APP_ENV!;
export const BASE_API_URL = envConfig.BASE_API_URL;
export const REACT_APP_URL = process.env.REACT_APP_URL!;
export const TOKEN_COOKIE_KEY = 'access_token'
export const TOKEN_HEADER_KEY = 'authorization'
export const CITY = "Pune"
export const APP_LOCALE = "en-GB"
