import { IProductCategory } from "../types";

export interface IAuthor {
  id: number;
  firstname: string;
  lastname: string;
  img: string;
}
export interface IBlog {
  id: number;
  title: string;
  description: string;
  img: string;
  short_desc: string;
  content: string;
  author: IAuthor;
  creationDate: string;
}

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


