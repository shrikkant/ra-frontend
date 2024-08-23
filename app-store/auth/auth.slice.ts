import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types";
import { IAuthState } from "./types";
import { RootState } from "../store";

const initialState: IAuthState = {};

export const authSlice = createSlice({
	name: 'authSlice',
	initialState,
	reducers: {
		authUser(state, action: PayloadAction<IUser>) {
			state.user = action.payload;
		},
		removeUser(state) {
			state.user = undefined;
		}
	},
});


export const { authUser, removeUser } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth.user;

export default authSlice.reducer;
