import { IOrder, IUser } from "../types";

export interface AdminState {
	customers?: IUser[] | null,
	activeCustomer?: IUser | null,
	orders?: IOrder[] | null,
	activeOrder?: IOrder | null,
}
