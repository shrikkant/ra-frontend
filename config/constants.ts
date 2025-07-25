// import getConfig from "next/config";

// const { publicRuntimeConfig: envConfig } = getConfig();

export interface ICountry {
  code: string
  urlBase: string
  locations: string[]
  states: string[]
}
import {ENV_CONFIG} from './environment'

export const ENV = ENV_CONFIG.REACT_APP_ENV!
// export const BASE_API_URL = envConfig.BASE_API_URL;
export const BASE_URL = ENV_CONFIG.BASE_URL
export const BASE_API_URL = ENV_CONFIG.REACT_APP_API_URL!
export const REACT_APP_URL = ENV_CONFIG.REACT_APP_URL!
export const TOKEN_COOKIE_KEY = 'access_token'
export const TOKEN_HEADER_KEY = 'authorization'
export const CITY = 'Pune'
export const APP_LOCALE = 'en-GB'

export const enum ARTICLE_TYPES {
  BLOG = 0,
  SEO_ARTICLE = 1,
  HELP_ARTICLE = 2,
}

export const DEFAULT_CURRENCY = 'INR'

export const enum ORDER_STEPS {
  ORDER_STEP_CART = 0,
  ORDER_STEP_ADDRESS = 1,
  ORDER_STEP_DELIVERY = 2,
  ORDER_STEP_PAYMENT = 3,
  ORDER_PAID = 4,
}

export const enum INPUT_ICON_TYPES {
  EMAIL = 1,
  PASSWORD = 2,
  MAP = 3,
  PHONE = 4,
  OTP = 5,
}

export const enum SIGNIN_SOURCE {
  GOOGLE = 'G',
  FACEBOOK = 'F',
  PHONE = 'P',
}

export const SIGNIN_SOURCE_LABELS = {
  [SIGNIN_SOURCE.GOOGLE]: 'Google',
  [SIGNIN_SOURCE.FACEBOOK]: 'Facebook',
  [SIGNIN_SOURCE.PHONE]: 'Phone',
} as const

export const DISCOUNT_STEPS = [
  {
    days: 14,
    discount: 50,
  },
  {
    days: 10,
    discount: 35,
  },
  {
    days: 7,
    discount: 25,
  },
  {
    days: 5,
    discount: 15,
  },
  {
    days: 3,
    discount: 10,
  },
  {
    days: 2,
    discount: 5,
  },
  {
    days: 1,
    discount: 0,
  },
]

const COUNTRIES: ICountry[] = []

const ind: ICountry = {
  code: 'IN',
  urlBase: '',
  locations: [
    'Bangalore',
    'Jaipur',
    'Ahmedabad',
    'Pune',
    'Kochi',
    'Navi Mumbai',
    'Thane',
    'Coimbatore',
    'Mumbai',
    'Hyderabad',
    'Chandigarh',
    'Ahmedabad',
    'Chennai',
    'Nashik',
    'Kolkata',
    'Patna',
    'Indore',
    'Kolhapur',
    'Surat',
    'Vadodara',
    'Nagpur',
    'Bhopal',
    'Madurai',
    'Gandhinagar',
    'Rajkot',
    'Jodhpur',
    'Udaipur',
    'Jaisalmer',
    'Gurugram',
    'Lucknow',
    'Vishakhapatnam',
    'Bhubaneswar',
    'Ludhiana',
    'Thiruvananthapuram',
    'Amritsar',
    'Vijayawada',
    'Mysuru',
    'Guwahati',
    'Dehradun',
    'Ranchi',
    'Raipur',
    'Mangalore',
    'Trichy',
  ],
  states: ['Goa'],
}

const nz: ICountry = {
  code: 'NZ',
  urlBase: 'nz/',
  locations: ['Auckland'],
  states: [],
}

COUNTRIES.push(ind)
COUNTRIES.push(nz)

export default COUNTRIES

// Verification Flags
export const VERIFICATION_FLAGS = {
  PHONE: 0b001, // 1
  AADHAAR: 0b010, // 2
  EMAIL: 0b100, // 4
} as const

// Helper function to check verification status
export const isVerified = (userVerified: number, flag: number): boolean => {
  return (userVerified & flag) === flag
}
