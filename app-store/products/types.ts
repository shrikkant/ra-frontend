import { IProduct, IProductCategory } from "../types";

export interface ProductsState {
	featuredProducts?: IProduct[];
	activeProduct?: IProduct;
	searchResults?: IProduct[]; 
	searchMetaData?:any;
}