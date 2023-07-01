import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProductsState } from './types';
import { AppState } from '../../store';

const initialState: MyProductsState = {};

export const productsSlice = createSlice({
	name: 'productsSlice',
	initialState,
	reducers: {
		setProducts(state, action: PayloadAction<any>) {
			state.products = action.payload;
		},
	},
});

export const { setProducts } = productsSlice.actions;

export const getMyProducts = (state: AppState) => state.myProducts.products;

export default productsSlice.reducer;