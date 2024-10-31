
import axios from "axios";
import { IUser } from "../../app-store/types";
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
  console.log("phone", phone, "otp", otp);
  const response: IUser = await httpClient.post(`verify-otp`, { phone, otp });
  return response;
}

export const loginWithOTP = async (phone: string, otp: string): Promise<IUser> => {
  console.log("phone", phone, "otp", otp);

  const httpService = new HttpService("https://www.rentacross.com/");

  const response: IUser = await httpService.getClient().post(`auth/local`, { phone, otp });
  return response;
}

export const signupWithOTP = async (phone: string, otp: string, name: string): Promise<IUser> => {

  const httpService = new HttpService("https://www.rentacross.com/");

  const response: IUser = await httpService.getClient().post(`auth/signup`, { phone, otp, name });
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
