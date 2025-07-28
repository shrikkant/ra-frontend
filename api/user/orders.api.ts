import {IDates} from '../../app-store/app-defaults/types'
import {IOrder, ITransaction} from '../../app-store/types'
import httpClient, {getToken} from './../axios.config'
import {ENV_CONFIG} from '../../config/environment'
import {TOKEN_HEADER_KEY} from '../../config/constants'
import Moment from 'moment'

interface Dates {
  startDate: Date
  endDate: Date
}

export async function fetchOrders(): Promise<IOrder[]> {
  const orders: IOrder[] = await httpClient.get(`/user/orders`)
  return orders
}

export async function fetchCart(): Promise<IOrder> {
  const response: IOrder[] = await httpClient.get(`/user/orders?status=0`)
  return response && response[0]
}

export async function fetchOrder(orderId: number): Promise<IOrder> {
  const response: IOrder = await httpClient.get(`/user/orders/${orderId}`)
  return response
}

export const addToCart = async (
  productId: number,
  dates: IDates,
): Promise<IOrder> => {
  const {startDate, endDate} = dates

  const START_HOUR = 9 // 9 AM
  const END_HOUR = 19 // 7 PM
  const order: IOrder = await httpClient.post(`/user/carts`, {
    date: {
      startDate: Moment(new Date(startDate)).format('YYYY-MM-DD'),
      endDate: Moment(new Date(endDate)).format('YYYY-MM-DD'),
      startTime: START_HOUR,
      endTime: END_HOUR,
      rentalDays: 1,
    },
    product_id: productId,
  })
  return order
}

export const removeFromCart = async (productId: number) => {
  await httpClient.delete(`/user/carts/` + productId)
}

export const processPayment = async paymentResponse => {
  // dev instance hack. not to be used in production.
  const response = await httpClient.post(
    `/user/payment/process`,
    paymentResponse,
  )
  return response
}

export const createRazorPayOrder = async razorPayOrderDetails => {
  const response = await httpClient.post(
    '/user/payment/razorPayOrder',
    razorPayOrderDetails,
  )
  return response
}

export const updateDeliveryAddress = async (orderId, address) => {
  const response: IOrder = await httpClient.put(
    '/user/orders/' + orderId + '?mode=1',
    address,
  )

  return response
}

// Rental Agreement API functions
export const getRentalAgreementPDF = async (orderId: number): Promise<Blob> => {
  const token = await getToken()
  console.log('Fetching PDF for order:', orderId)
  console.log('Token:', token ? 'Present' : 'Missing')
  console.log(
    'URL:',
    `${ENV_CONFIG.CLIENT_API_BASE_URL}user/orders/${orderId}/rental-agreement/pdf`,
  )

  const response = await fetch(
    `${ENV_CONFIG.CLIENT_API_BASE_URL}user/orders/${orderId}/rental-agreement/pdf`,
    {
      method: 'GET',
      headers: {
        [TOKEN_HEADER_KEY]: token || '',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/pdf',
        referer: 'https://rentacross.com',
      },
    },
  )

  console.log('Response status:', response.status)
  console.log(
    'Response headers:',
    Object.fromEntries(response.headers.entries()),
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PDF fetch failed:', errorText)
    throw new Error(
      `Failed to fetch rental agreement PDF: ${response.status} ${response.statusText}`,
    )
  }

  const blob = await response.blob()
  console.log('Blob received:', {
    size: blob.size,
    type: blob.type,
  })

  // Check if the blob is actually a PDF
  if (blob.size === 0) {
    throw new Error('Received empty PDF blob')
  }

  // Always check the content regardless of MIME type
  const arrayBuffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4))
  console.log('PDF header check:', pdfHeader)
  console.log('Blob size:', blob.size, 'bytes')

  if (pdfHeader !== '%PDF') {
    console.error('Response is not a valid PDF file. Header:', pdfHeader)
    // Check if it's a JSON response instead
    const responseText = String.fromCharCode(...uint8Array)
    if (responseText.startsWith('{') || responseText.startsWith('[')) {
      console.error('Backend returned JSON instead of PDF:', responseText)
      throw new Error('Backend returned JSON error instead of PDF')
    }
    throw new Error('Response is not a valid PDF file')
  }

  console.log('Valid PDF detected, size:', blob.size, 'bytes')
  return blob
}

export const initializeRentalAgreementSign = async (
  orderId: number,
): Promise<any> => {
  const response = await httpClient.post(
    `/v1/users/orders/${orderId}/initialize`,
  )

  console.log('response', response.data)
  return response.data
}

// Debug function to test PDF generation
export const testPDFGeneration = async (orderId: number): Promise<void> => {
  const token = await getToken()
  console.log('Testing PDF generation for order:', orderId)

  try {
    const response = await fetch(
      `${ENV_CONFIG.CLIENT_API_BASE_URL}/user/orders/${orderId}/rental-agreement/pdf`,
      {
        method: 'GET',
        headers: {
          [TOKEN_HEADER_KEY]: token || '',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )

    console.log('Test response status:', response.status)
    console.log(
      'Test response headers:',
      Object.fromEntries(response.headers.entries()),
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Test PDF fetch failed:', errorText)
      return
    }

    const text = await response.text()
    console.log(
      'Test response as text (first 500 chars):',
      text.substring(0, 500),
    )
    console.log('Test response length:', text.length)

    // Check if it looks like JSON error response
    if (text.startsWith('{') || text.startsWith('[')) {
      console.error('Backend returned JSON instead of PDF:', text)
    }
  } catch (error) {
    console.error('Test PDF generation error:', error)
  }
}
