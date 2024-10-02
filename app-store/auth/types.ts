import { IUser } from "../types";


export interface IAuthState {
	user?: IUser;
	isAdminLogin?: boolean;
}
