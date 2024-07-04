import { IProduct, IProductCategory } from "../types";

export interface IHomeSlide {
	id: number;
	title: string;
	img: string;
	subtitle: string;
	imgBg: string;
	price: number;
	model: string;
	url?: string;
}
export interface ProductsState {
	featuredProducts?: IProduct[];
	activeProduct?: IProduct;
	searchResults?: IProduct[];
	searchMetaData?: any;
}
