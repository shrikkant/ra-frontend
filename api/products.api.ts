/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct, IProductCategory, IProductFilter, ProductPhoto } from '../app-store/types';
import httpClient, { fetchData } from './axios.config';


export async function getFeaturedProducts(pageLimit: number, city: string): Promise<any[]> {

  const response = fetchData(`getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`); //await httpClient.get<IProduct[], IProduct[]>(``);
  return response;

}

export async function fetchProductCategories(): Promise<IProductCategory[]> {
  const response = await fetchData(`categories`);
  return response;
}

export async function fetchCategoriesClient(): Promise<IProductCategory[]> {
  const response = await httpClient.get<IProductCategory[]>(`categories`);
  return response;
}

export async function fetchProducts(searchString?: string,
  filter?: IProductFilter,
  client?: boolean): Promise<{ results: IProduct[], meta }> {

  const PAGE_LIMIT = 24;
  const pageNumber = filter ? (filter.page ? filter.page : 0) : 0;
  const pageFilter = `&pageLimit=${PAGE_LIMIT}&pageNumber=${pageNumber}`;
  const cityFilter = filter?.city ? `&city=${filter?.city}` : "";
  const stateFilter = filter?.state ? `&state=${filter?.state}` : "";
  const searchQuery = searchString ? searchString.replace(" ", "+") : "";

  const rateFilter = filter?.rate ? "&rate=" + filter.rate[0] + "-" + filter.rate[1] : "";
  const brandFilter = filter?.brand ? "&brands=" + filter.brand.map(b => b + " ") : "";
  const catFilter = filter?.subCategory ? "&subCat=" + filter?.subCategory : "";


  const url =
    `products/?searchString=${searchQuery + pageFilter + stateFilter + cityFilter + rateFilter + brandFilter + catFilter}`;
  if (client) {
    return httpClient.get(url);
  } else {
    return fetchData(url);
  }

}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {

  const response = await fetchData(`products/.by.slug/${slug}`);
  return response;
}

export const fetchProductPhoto = async (id: number): Promise<ProductPhoto> => {
  const response: any = await httpClient.get<ProductPhoto>(`products/${id}/photo`);
  return response;
}


export async function fetchProduct(filter): Promise<IProduct> {
  const response = await httpClient.get<string, IProduct>(`products/.by.slug/${filter.product}?city=${filter?.city}&subCat=${filter.subCategory}`);
  return response;
}
