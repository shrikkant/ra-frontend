/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IProduct,
  IProductCategory,
  IProductFilter,
  ProductPhoto,
} from '../app-store/types'
import httpClient, {fetchData, fetchDataServer} from './axios.config'

// Client-side version
export async function getFeaturedProducts(
  pageLimit: number,
  city: string,
): Promise<any[]> {
  const url = `getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`
  return fetchData(url)
}

// Server-side version
export async function getFeaturedProductsServer(
  pageLimit: number,
  city: string,
): Promise<any[]> {
  const url = `getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`
  return fetchDataServer(url, {next: {revalidate: 3600}} as any)
}

export async function fetchProductCategories(): Promise<IProductCategory[]> {
  return fetchData('categories')
}

export async function fetchCategoriesClient(): Promise<IProductCategory[]> {
  return httpClient.get<IProductCategory[]>('v1/categories')
}

export async function fetchProducts(
  searchString?: string,
  filter?: IProductFilter,
  client?: boolean,
): Promise<{results: IProduct[]; meta: any}> {
  const PAGE_LIMIT = 24
  const pageNumber = filter ? (filter.page ? filter.page : 0) : 0
  const pageFilter = `&pageLimit=${PAGE_LIMIT}&pageNumber=${pageNumber}`
  const cityFilter = filter?.city ? `&city=${filter?.city}` : ''
  const stateFilter = filter?.state ? `&state=${filter?.state}` : ''
  const searchQuery = searchString ? searchString.replace(' ', '+') : ''

  const rateFilter = filter?.rate
    ? '&rate=' + filter.rate[0] + '-' + filter.rate[1]
    : ''
  const brandFilter = filter?.brand
    ? '&brands=' + filter.brand.map(b => b + ' ')
    : ''
  const catFilter = filter?.subCategory ? '&subCat=' + filter?.subCategory : ''

  const url = `products/?searchString=${searchQuery + pageFilter + stateFilter + cityFilter + rateFilter + brandFilter + catFilter}`
  if (client) {
    return httpClient.get(url)
  } else {
    return fetchData(url)
  }
}

// Server-side version of fetchProducts
export async function fetchProductsServer(
  searchString?: string,
  filter?: IProductFilter,
): Promise<{results: IProduct[]; meta: any}> {
  const PAGE_LIMIT = 24
  const pageNumber = filter ? (filter.page ? filter.page : 0) : 0
  const pageFilter = `&pageLimit=${PAGE_LIMIT}&pageNumber=${pageNumber}`
  const cityFilter = filter?.city ? `&city=${filter?.city}` : ''
  const stateFilter = filter?.state ? `&state=${filter?.state}` : ''
  const searchQuery = searchString ? searchString.replace(' ', '+') : ''

  const rateFilter = filter?.rate
    ? '&rate=' + filter.rate[0] + '-' + filter.rate[1]
    : ''
  const brandFilter = filter?.brand
    ? '&brands=' + filter.brand.map(b => b + ' ')
    : ''
  const catFilter = filter?.subCategory ? '&subCat=' + filter?.subCategory : ''

  const url = `products/?searchString=${searchQuery + pageFilter + stateFilter + cityFilter + rateFilter + brandFilter + catFilter}`
  return fetchDataServer(url)
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  return fetchData(`products/.by.slug/${slug}`)
}

// Server-side version of fetchProductBySlug
export async function fetchProductBySlugServer(slug: string): Promise<IProduct> {
  return fetchDataServer(`products/.by.slug/${slug}`, {next: {revalidate: 300}} as any)
}

export const fetchProductPhoto = async (id: number): Promise<ProductPhoto> => {
  const response: any = await httpClient.get<ProductPhoto>(
    `products/${id}/photo`,
  )
  return response
}

export async function fetchProduct(filter: any): Promise<IProduct> {
  const response = await httpClient.get<IProduct>(
    `products/.by.slug/${filter.product}?city=${filter?.city}&subCat=${filter.subCategory}`,
  )
  return response
}
