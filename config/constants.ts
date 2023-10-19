import getConfig from 'next/config';

const { publicRuntimeConfig: envConfig } = getConfig()

export const ENV = process.env.REACT_APP_ENV!;
export const BASE_API_URL = envConfig.BASE_API_URL;
export const REACT_APP_URL = process.env.REACT_APP_URL!;
export const TOKEN_COOKIE_KEY = 'access_token'
export const TOKEN_HEADER_KEY = 'authorization'
export const CITY = "Pune"
export const APP_LOCALE = "en-GB"

export const enum ORDER_STEPS {
  ORDER_STEP_DELIVERY = 1,
  ORDER_STEP_PAYMENT = 2
}

const COUNTRIES = [];

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
  "Patna"
];

const nz: any = {};
nz.code = "NZ";
nz.urlBase = "nz/";
nz.locations = ["Auckland"];
nz.states = [];

COUNTRIES.push(ind);
COUNTRIES.push(nz);

export default COUNTRIES;

