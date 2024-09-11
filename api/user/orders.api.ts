import { IDates } from "../../app-store/app-defaults/types";
import { IOrder } from "../../app-store/types";
import httpClient from "./../axios.config";
import Moment from "moment";

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

export async function fetchOrder(orderId: number): Promise<IOrder> {
  const response: IOrder = await httpClient.get(`/user/orders/${orderId}`);
  return response;
}

export const addToCart = async (
  productId: number,
  dates: IDates
) => {
  const { startDate, endDate } = dates;

  await httpClient.post(`/user/carts`, {
    date: {
      startDate: Moment(startDate).format("YYYY-MM-DD"),
      endDate: Moment(endDate).format("YYYY-MM-DD"),
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
  return response;
};

export const updateDeliveryAddress = async (orderId, address) => {
  const response: IOrder = await httpClient.put(
    "/user/orders/" + orderId + "?mode=1",
    address
  );

  return response;
};
