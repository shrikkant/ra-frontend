import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState } from '../../app-store/admin/types';
import { RootState } from 'app-store/store';

const initialState: AdminState = {};

export const adminSlice = createSlice({
	name: 'customersSlice',
	initialState,
	reducers: {
		setCustomers(state, action: PayloadAction<any>) {
			state.customers = action.payload;
		},
		setActiveCustomer(state, action: PayloadAction<any>) {
			state.activeCustomer = action.payload;
		}
	},

});

export const { setCustomers } = adminSlice.actions;
export const { setActiveCustomer } = adminSlice.actions;

export const getCustomers = (state: RootState) => {
  return state.admin.customers;
} ;

export const getActiveCustomer = (state: RootState) => {
  return state.admin.activeCustomer;
} ;

export default adminSlice.reducer;
