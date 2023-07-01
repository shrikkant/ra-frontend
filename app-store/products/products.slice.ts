import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductsState } from './types';
import { fetchProducts, getFeaturedProducts } from '../../api/products.api';
import { AppDispatch, RootState } from '../store';
import { IProductFilter } from '../types';


const initialState: ProductsState = {};

export const productsSlice = createSlice({
	name: 'productsSlice',
	initialState,
	reducers: {
		setFeaturedProducts(state, action: PayloadAction<any>) {
			state.featuredProducts = action.payload;
		},
		setActiveProduct(state, action: PayloadAction<any>) {
			state.activeProduct = action.payload;
		},
		setSearchResults(state, action: PayloadAction<any>) {
			state.searchResults = action.payload;
		},
		setSearchMetaData(state, action: PayloadAction<any>) {
			state.searchMetaData = action.payload;
		}
	},
});

export const { setActiveProduct } = productsSlice.actions;
export const { setSearchResults } = productsSlice.actions;
export const { setSearchMetaData } = productsSlice.actions;

export const getActiveProduct = (state: RootState) => state.products.activeProduct;
export const getSearchResults = (state: RootState) => state.products.searchResults;
export const getSearchMetaData = (state: RootState) => state.products.searchMetaData;

export const getSearchResultsAction =
	(searchString: string, filter: IProductFilter) => async (dispatch: AppDispatch) => {

		const response = await fetchProducts(searchString, filter);
		console.log("results > ", response.results);
		dispatch(productsSlice.actions.setSearchResults(response.results));
		dispatch(productsSlice.actions.setSearchMetaData(response.meta));
	};

export const getFeaturedProductsAction =
	(pageLimit: number, city: string) => async (dispatch: AppDispatch) => {
		const response = await getFeaturedProducts(pageLimit, city);
		dispatch(productsSlice.actions.setFeaturedProducts(response))
	};



export default productsSlice.reducer;
