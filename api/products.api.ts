import { IProduct, IProductCategory, IProductFilter } from '../app-store/types';
import httpClient from './axios.config';


export async function getFeaturedProducts(pageLimit: number, city: string): Promise<IProduct[]> {

  const response: IProduct[] = await httpClient.get<IProduct[], IProduct[]>(`getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`);
  return response;

}

export async function fetchProductCategories(): Promise<IProductCategory[]> {
  const response = await httpClient.get<string, IProductCategory[]>(`categories`);
  return response;
}

export async function fetchProducts(searchString?: string,
  filter?: IProductFilter): Promise<IProduct[]> {

  const PAGE_LIMIT = 24;
  const pageNumber = filter ? (filter.page ? filter.page : 0) : 0;
  const pageFilter = `&pageLimit=${PAGE_LIMIT}&pageNumber=${pageNumber}`;
  const cityFilter = `&city=${filter?.city}`;
  const searchQuery = searchString ? searchString.replace(" ", "+") : "";

  const rateFilter = filter?.rate ? "&rate=" + filter.rate[0] + "-" + filter.rate[1] : "";
  const brandFilter = filter?.brand ? "&brands=" + filter.brand.map(b => b + " ") : "";
  const catFilter = filter?.subCategory ? "&subCat=" + filter?.subCategory : "";

  const url =
    `products/?searchString=${searchQuery + pageFilter + cityFilter + rateFilter + brandFilter + catFilter}`;

  const response = await httpClient.
    get<string, IProduct[]>(url);

  return response;

}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {

  const response = await httpClient.get<string, IProduct>(`products/.by.slug/${slug}`);
  return response;
}


export async function fetchProduct(filter): Promise<IProduct> {

  const response = await httpClient.get<string, IProduct>(`products/.by.slug/${filter.product}?city=${filter?.city}&subCat=${filter.subCategory}`);
  console.log("Product >>>> ", response);
  return response;
}
