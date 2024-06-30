import { IDates } from "../../app-store/app-defaults/types";
import { IOrder, ITransaction } from "../../app-store/types";
import httpClient from "./../axios.config";

interface Dates {
  startDate: Date;
  endDate: Date;
}

export async function fetchOrders(): Promise<IOrder[]> {
  const orders: IOrder[] = await httpClient.get(`/user/orders`);
  return orders;
}

export async function fetchCart(): Promise<IOrder> {
  const response: IOrder[] = await httpClient.get(`/user/orders?status=0`);
  return response && response[0];
}

export const addToCart = async (
  productId: number,
  dates: IDates
) => {
  const { startDate, endDate } = dates;

  await httpClient.post(`/user/carts`, {
    date: {
      startDate: startDate,
      endDate: endDate,
      startTime: 9,
      endTime: 9,
      rentalDays: 1,
    },
    product_id: productId,
  });
};

export const removeFromCart = async (productId: number) => {
  await httpClient.delete(
    `/user/carts/` + productId
  );
};

export const processPayment = async (paymentResponse) => {
  // dev instance hack. not to be used in production.
  const response = await httpClient.post(
    `/user/payment/process`,
    paymentResponse
  );
  return response;
};

export const createRazorPayOrder = async (razorPayOrderDetails) => {
  const response = await httpClient.post(
    "/user/payment/razorPayOrder",
    razorPayOrderDetails
  );
  console.log("Response :### ", response);
  return response;
};

export const updateDeliveryAddress = async (orderId, address) => {
  console.log("Updating!!!! Address! : ", address);
  const response: IOrder = await httpClient.put(
    "/user/orders/" + orderId + "?mode=1",
    address
  );
  console.log("Response : ", response);

  return response;
};
