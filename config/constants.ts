import getConfig from "next/config";

// const { publicRuntimeConfig: envConfig } = getConfig();

export const ENV = process.env.REACT_APP_ENV!;
// export const BASE_API_URL = envConfig.BASE_API_URL;
// export const BASE_URL = envConfig.BASE_URL;
export const BASE_API_URL = process.env.REACT_APP_API_URL!;
export const REACT_APP_URL = process.env.REACT_APP_URL!;
export const TOKEN_COOKIE_KEY = "access_token";
export const TOKEN_HEADER_KEY = "authorization";
export const CITY = "Pune";
export const APP_LOCALE = "en-GB";

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
}

const COUNTRIES: any = [];

const ind: any = {};
ind.code = "IN";
ind.urlBase = "";
ind.states = ["Goa"];

ind.locations = [
  "Bengaluru",
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
];

const nz: any = {};
nz.code = "NZ";
nz.urlBase = "nz/";
nz.locations = ["Auckland"];
nz.states = [];

COUNTRIES.push(ind);
COUNTRIES.push(nz);

export default COUNTRIES;
