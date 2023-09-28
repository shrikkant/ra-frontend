import { IProductFilter } from '../app-store/types';
import httpClient from './axios.config';

export async function getFeaturedProducts(pageLimit: number, city: string): Promise<any> {
  try {
    const response = await httpClient.get<any>(`getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`);
    return response;
  } catch (e) {
    throw e;
  }
}

export async function fetchProductCategories(): Promise<any> {
  try {
    const response = await httpClient.get<any>(`categories`);
    return response;
  } catch (e) {
    throw e;
  }
}

export async function fetchProducts(searchString?: string,
  filter?: IProductFilter): Promise<any> {
  try {
    const PAGE_LIMIT = 24;
    const pageNumber = filter?(filter.page ? filter.page : 0):0;
    const pageFilter = `&pageLimit=${PAGE_LIMIT}&pageNumber=${pageNumber}`;
    const cityFilter = `&city=${filter?.city}`;
    const searchQuery = searchString?searchString.replace(" ", "+"):"";

    const rateFilter = filter?.rate ? "&rate=" + filter.rate[0] + "-" + filter.rate[1] : "";
    const brandFilter = filter?.brand ? "&brands=" + filter.brand.map(b => b + " ") : "";
    const catFilter = filter?.subCategory ? "&subCat=" + filter?.subCategory : "";


    const url =
    `products/?searchString=${searchQuery + pageFilter + cityFilter + rateFilter + brandFilter + catFilter}`;

    const response = await httpClient.
      get(url);

    return response;
  } catch (e) {
    throw e;
  }
}

export async function fetchProductBySlug(slug: string): Promise<any> {
  try {
    const response = await httpClient.get<any>(`products/?slug=${slug}`);

    return response;
  } catch (e) {
    throw e;
  }
}
