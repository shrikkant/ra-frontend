import { IUser } from "../types";


export interface IAuthState {
	user?: IUser;
	isAdminLogin?: boolean;
}

export interface IAadhaar {
	full_name: string;
	aadhaar_number: string;
	dob: Date;
	gender: string;
	address: {
		country: string;
		dist: string;
		state: string;
		po: string;
		loc: string;
		vtc: string;
		subdist: string;
		street: string;
		house: string;
		landmark: string;
	},
	face_status: boolean,
	face_score: -1,
	zip: string;
	profile_image: string;
}
