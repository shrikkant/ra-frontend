import { IProductCategory } from "../types";


export interface ITestimonial {
  id?: number;
  name: string;
  description: string;
  img: string;
  rating: number;
}
export interface AppDefaultsState {
  categories?: IProductCategory[];
  searchDefaults?: any;
}


