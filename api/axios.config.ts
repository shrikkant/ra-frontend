/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosResponse} from 'axios'
import Cookies from 'js-cookie'

import {TOKEN_COOKIE_KEY, TOKEN_HEADER_KEY} from '../config/constants'
import {displayMessage} from '../util/global.util'
import {ENV_CONFIG} from '../config/environment'

export const getToken = async () => Cookies.get(TOKEN_COOKIE_KEY)

export class HttpService {
  private url: string
  private client: AxiosInstance

  constructor(url?: string) {
    this.client = axios.create({
      baseURL: url || ENV_CONFIG.CLIENT_API_BASE_URL,
    })

    this.client.interceptors.request.use(
      async (config: any) => {
        config.rejectUnauthorized = true

        if (!config.headers?.[TOKEN_HEADER_KEY]) {
          const token = await getToken()
          config.headers = {
            TOKEN_HEADER_KEY: token || '',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            ...config.headers,
          }
        }

        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    this.client.interceptors.response.use(async function (
      res: AxiosResponse<any>,
    ) {
      const response: any = res
      const {resultFormatted} = response.data
      // console.log("Response Message: ", response.data);
      if (response.data?.successMessage) {
        displayMessage('success', response.data?.successMessage)
      } else if (response.data?.errorMessage) {
        displayMessage('error', response.data?.errorMessage)
      }
      return resultFormatted
    })
  }

  getClient(): AxiosInstance {
    return this.client
  }
}
const httpClient = axios.create({
  baseURL: ENV_CONFIG.CLIENT_API_BASE_URL,
})

httpClient.interceptors.request.use(
  async (config: any) => {
    const token = await getToken()
    config.rejectUnauthorized = true
    if (!config.headers?.[TOKEN_HEADER_KEY]) {
      config.headers = {
        TOKEN_HEADER_KEY: token || '',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        ...config.headers,
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

httpClient.interceptors.response.use(
  async function <T>(
    res: AxiosResponse<{
      resultFormatted: T
      successMessage?: string
      errorMessage?: string
    }>,
  ): Promise<T> {
    const response = res

    if (response.data?.successMessage) {
      displayMessage('success', response.data.successMessage)
    } else if (response.data?.errorMessage) {
      displayMessage('error', response.data.errorMessage)
    }
    return response.data.resultFormatted
  },
  error => {
    if (error.status === 401) {
      if (window.location.href.indexOf('signUp=true') === -1) {
        window.location.href = '/?signUp=true'
      }
    }
    return Promise.reject(error)
  },
)

export const fetchData = async (url, customOptions?) => {
  // console.log(' URL > ', ENV_CONFIG.CLIENT_API_BASE_URL)
  const commonOptions = {
    headers: {'Content-Type': 'application/json'},
    referrer: ENV_CONFIG.BASE_URL,
    cache: 'force-cache',
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  const response: any = await fetch(
    `${ENV_CONFIG.SERVER_API_BASE_URL}${url}`,
    options,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }

  const {resultFormatted} = await response.json()

  return resultFormatted
}

export default httpClient

// Override the default axios types
declare module 'axios' {
  interface AxiosInstance {
    get<T = any>(url: string): Promise<T>
    post<T = any>(url: string, data?: any, config?: any): Promise<T>
    put<T = any>(url: string, data?: any): Promise<T>
    patch<T = any>(url: string, data?: any): Promise<T>
    delete<T = any>(url: string): Promise<T>
  }
}
