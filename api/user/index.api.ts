
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
