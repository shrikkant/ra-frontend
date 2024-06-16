import { IProductFilter } from '../app-store/types';
import httpClient from './axios.config';
import { fetchData } from './axios.config';

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
      get(url);

    return response;
  } catch (e) {
    throw e;
  }
}

export async function fetchProductBySlug(slug: string): Promise<any> {
  try {
    const response = await httpClient.get<any>(`products/.by.slug/${slug}`);
    return response;
  } catch (e) {
    throw e;
  }
}

export async function fetchBlogs(page: number, limit?: number, type?: number,): Promise<any> {
  try {
    // const response = await httpClient.get<any>(`blog?limit=4&page=${page || 1}`);
    const res = await fetchData(`blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`);


    return res;

  } catch (e) {
    throw e;
  }
}

export async function fetchBlogBySlug(slug: string): Promise<any> {
  try {
    const res = await fetchData(`blog/.by.slug/${slug}`);
    return res;
  } catch (e) {
    throw e;
  }
}


export async function fetchProduct(filter): Promise<any> {
  try {
    const response = await httpClient.get<any>(`products/.by.slug/${filter.product}?city=${filter?.city}&subCat=${filter.subCategory}`);
    console.log("Product >>>> ", response);
    return response;
  } catch (e) {
    throw e;
  }
}
