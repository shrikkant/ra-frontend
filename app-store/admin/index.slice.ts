import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState } from '../../app-store/admin/types';
import { RootState } from 'app-store/store';
import exp from 'constants';

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
		},
		setOrders(state, action: PayloadAction<any>) {
			state.orders = action.payload;
		},
		setActiveOrder(state, action: PayloadAction<any>) {
			state.activeOrder = action.payload;
		},
		setBrands(state, action: PayloadAction<any>) {
			state.brands = action.payload;
		},
		setDeliveryReps(state, action: PayloadAction<any>) {
			state.deliveryReps = action.payload;
		}

	},

});

export const { setCustomers } = adminSlice.actions;
export const { setActiveCustomer } = adminSlice.actions;
export const { setOrders } = adminSlice.actions;
export const { setActiveOrder } = adminSlice.actions;
export const { setBrands } = adminSlice.actions;
export const { setDeliveryReps } = adminSlice.actions;



export const getCustomers = (state: RootState) => {
	return state.admin.customers;
};

export const getBrands = (state: RootState) => {
	return state.admin.brands;
};

export const getActiveCustomer = (state: RootState) => {
	return state.admin.activeCustomer;
};

export const getOrders = (state: RootState) => {
	return state.admin.orders;
};

export const getActiveOrder = (state: RootState) => {
	return state.admin.activeOrder;
};

export const getDeliveryReps = (state: RootState) => {
	return state.admin.deliveryReps;
};

export default adminSlice.reducer;
