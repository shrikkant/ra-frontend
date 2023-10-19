import { IOrder, ITransaction } from "../../app-store/types";
import httpClient from "./../axios.config";

interface Dates {
	startDate: Date;
	endDate: Date;
}

export async function fetchOrders(): Promise<IOrder[]> {
	try {
    const orders: IOrder[] = await httpClient.get(`/user/orders`);

		return orders;
	} catch (e) {
		throw e;
	}
}

export async function fetchCart(): Promise<IOrder> {
	try {
		const response: IOrder[] = await httpClient.get(
			`/user/orders?status=0`
		);

		return response && response[0];
	} catch (e) {
		throw e;
	}
}

export const addToCart = async (
	productId: number,
	dates: Dates
): Promise<IOrder> => {
	const { startDate, endDate } = dates;

	const response: ITransaction[] = await httpClient.post(`/user/carts`, {
		date: {
			startDate: startDate,
			endDate: endDate,
			startTime: 9,
			endTime: 9,
			rentalDays: 1,
		},
		product_id: productId,
	});

	return;
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
