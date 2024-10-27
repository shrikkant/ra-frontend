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
  slug: string;
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

export interface IDates {
  startDate: Date,
  endDate: Date,
  key?: string,
}


export interface IDocument {
  id?: number;
  user_id?: number;
  file_name?: string;
  type: number;
  size: number;
  file_type: string;
  document_name?: string;
  verified?: boolean;
  verified_by?: string;
  document_id?: string;
  document_data: any;
  client_id: string;
  address_id: number;
  document_type: string;
  url: string;

}

export interface ISearchLocation {
  city?: string;
}

export interface IDefaultSearch {
  location?: {
    city?: string;
  },
  dates?:
  IDates

}


