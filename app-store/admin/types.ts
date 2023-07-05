import { IUser } from "../types";

export interface AdminState {
	customers?: IUser[] | null,
	activeCustomer?: IUser | null
}
