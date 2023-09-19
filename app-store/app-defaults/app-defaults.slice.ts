import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDefaultsState } from './types';
import { fetchProductCategories, fetchProducts, getFeaturedProducts } from '../../api/products.api';
import { AppDispatch, RootState } from '../store';
import { IProductFilter } from '../types';


const initialState: AppDefaultsState = {};

export const appDefaultsSlice = createSlice({
	name: 'appDefaultsSlice',
	initialState,
	reducers: {
		setCategories(state, action: PayloadAction<any>) {
			state.categories = action.payload;
		},
	},
});

export const { setCategories } = appDefaultsSlice.actions;

export const getCategories = (state: RootState) => state.appDefaults.categories;

export const getCategoriesAction =
	(searchString: string, filter: IProductFilter) => async (dispatch: AppDispatch) => {

		const response = await fetchProductCategories();
		dispatch(appDefaultsSlice.actions.setCategories(response.results));
	};


export default appDefaultsSlice.reducer;
