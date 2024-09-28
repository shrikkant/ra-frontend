
import { IUser } from "../../app-store/types";
import httpClient from "../axios.config";



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

export const updateAadhaar = async (aadhaar: string): Promise<IUser> => {
  const response: IUser = await httpClient.put(`user?mode=6`, { aadhaar });
  return response;
}

export const verifyAadhaarOTP = async (otp: string): Promise<IUser> => {
  const response: IUser = await httpClient.put(`user?mode=5`, { code: otp });
  return response;
}
