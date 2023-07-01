import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrdersState } from './types';
import { RootState } from '../../store';

const initialState: OrdersState = {};

export const ordersSlice = createSlice({
	name: 'ordersSlice',
	initialState,
	reducers: {
		setOrders(state, action: PayloadAction<any>) {
			state.orders = action.payload;
		},
		setCart(state, action: PayloadAction<any>) {
			state.cart = action.payload;
		}
	},

});

export const { setOrders } = ordersSlice.actions;

export const { setCart } = ordersSlice.actions;

export const getCart = (state: RootState) => state.orders.cart;
export const getOrders = (state: RootState) => state.orders.orders;

export default ordersSlice.reducer;
