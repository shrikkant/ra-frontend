
import { ILocation, IMasterProduct, IProduct, IUser } from "../../app-store/types";
import httpClient, { HttpService } from "../axios.config";



export const addNewAddress = async (
  place_id: string,
  address_line_1: string
) => {
  const newAddress = await httpClient.post(`/user/addresses/.by.place_id`, {
    place_id: place_id,
    address_line_1: address_line_1,
  });
  return newAddress;

};

export const addLocalAddress = async (
  address_line_1: string,
  address_line_2: string,
  city: string,
  state: string,
  postal_code: string,
  place_id: string
): Promise<ILocation> => {
  const newAddress: ILocation = await httpClient.post(`/user/addresses`, {
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    place_id,
  });
  return newAddress;
};

export const updatePhone = async (phone: string): Promise<IUser> => {
  const response: IUser = await httpClient.put(`user?mode=2`, { phone });
  return response;
}

export const generateLoginOTP = async (phone: string, newUser: boolean): Promise<IUser> => {
  const isNewUserQueryParam = newUser ? "newUser=true" : "";
  const response: IUser = await httpClient.post(`generate-otp?${isNewUserQueryParam}`, { phone });
  return response;
}

// remove this later
export const verifyLoginOTP = async (phone: string, otp: string): Promise<IUser> => {
  const response: IUser = await httpClient.post(`verify-otp`, { phone, otp });
  return response;
}

export const loginWithOTP = async (phone: string, otp: string): Promise<IUser> => {
  const httpService = new HttpService("https://www.rentacross.com/");
  const response: IUser = await httpService.getClient().post(`auth/local`, { phone, otp });
  return response;
}

export const signupWithOTP = async (phone: string, otp: string, name: string): Promise<IUser> => {

  const httpService = new HttpService("https://www.rentacross.com/");

  const response: IUser = await httpService.getClient().post(`auth/signup`, { phone, otp, name });
  return response;
}

export const listNewProduct = async (masterProduct: IMasterProduct, rate: number, addressId: number): Promise<IProduct> => {

  const rates = [
    { rate, duration: "D" },
  ]
  const newProduct = {
    address_id: addressId,
    master_product_id: masterProduct.id,
    title: masterProduct.name,
    category_id: masterProduct.category_id,
    sub_category_id: masterProduct.sub_category_id,
    qty: 1,
    rates,
  }

  const response: IProduct = await httpClient.post(`user/products/`, newProduct);
  return response;
}


export const updateAadhaar = async (aadhaar: string): Promise<IUser> => {
  const response: IUser = await httpClient.put(`user?mode=6`, { aadhaar });
  return response;
}

export const verifyAadhaarOTP = async (otp: string): Promise<IUser> => {
  const response: IUser = await httpClient.put(`user?mode=5`, { code: otp });
  return response;
}
