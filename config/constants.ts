// import getConfig from "next/config";

// const { publicRuntimeConfig: envConfig } = getConfig();

export interface ICountry {
  code: string;
  urlBase: string;
  locations: string[];
  states: string[];
}
export const ENV = process.env.REACT_APP_ENV!;
// export const BASE_API_URL = envConfig.BASE_API_URL;
export const BASE_URL = "https://www.rentacross.com";
export const BASE_API_URL = process.env.REACT_APP_API_URL!;
export const REACT_APP_URL = process.env.REACT_APP_URL!;
export const TOKEN_COOKIE_KEY = "access_token";
export const TOKEN_HEADER_KEY = "authorization";
export const CITY = "Pune";
export const APP_LOCALE = "en-GB";

export const STATUS_AADHAAR_VERIFIED = 3;

export const enum ARTICLE_TYPES {
  BLOG = 0,
  SEO_ARTICLE = 1,
  HELP_ARTICLE = 2,
}

export const DEFAULT_CURRENCY = "INR";

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

export const DISCOUNT_STEPS = [
  {
    days: 14,
    discount: 50
  },
  {
    days: 10,
    discount: 35
  },
  {
    days: 7,
    discount: 25
  },
  {
    days: 5,
    discount: 15
  },
  {
    days: 3,
    discount: 10
  },
  {
    days: 2,
    discount: 5
  },
  {
    days: 1,
    discount: 0
  },
]

const COUNTRIES: ICountry[] = [];

const ind: ICountry = {
  code: "IN",
  urlBase: "",
  locations: [
    "Bangalore",
    "Jaipur",
    "Ahmedabad",
    "Pune",
    "Kochi",
    "Navi-Mumbai",
    "Thane",
    "Coimbatore",
    "Mumbai",
    "Hyderabad",
    "Chandigarh",
    "Ahmedabad",
    "Chennai",
    "Nashik",
    "Kolkata",
    "Patna",
    "Indore",
  ],
  states: ["Goa"]
};



const nz: ICountry = {
  code: "NZ",
  urlBase: "nz/",
  locations: ["Auckland"],
  states: []
};


COUNTRIES.push(ind);
COUNTRIES.push(nz);

export default COUNTRIES;
