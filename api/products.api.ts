/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IProduct,
  IProductCategory,
  IProductFilter,
  ProductPhoto,
} from '../app-store/types'
// import {fetchStaticData} from '../app/utils/api'
import httpClient, {fetchData} from './axios.config'

export async function getFeaturedProducts(
  pageLimit: number,
  city: string,
): Promise<any[]> {
  const response = await httpClient.get(
    `getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`,
  )
  return response
}

export async function fetchProductCategories(): Promise<IProductCategory[]> {
  const response = await httpClient.get(`categories`)
  return response
}

export async function fetchCategoriesClient(): Promise<IProductCategory[]> {
  return []
  // const response = await fetchData(`categories`)
  // return response
}

export async function fetchProducts(
  searchString?: string,
  filter?: IProductFilter,
): Promise<{results: IProduct[]; meta}> {
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

  return httpClient.get(url)
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  const response = await httpClient.get(`products/.by.slug/${slug}`)
  return response
}

export const fetchProductPhoto = async (id: number): Promise<ProductPhoto> => {
  const response: any = await httpClient.get<ProductPhoto>(
    `products/${id}/photo`,
  )
  return response
}

export async function fetchProduct(filter): Promise<IProduct> {
  const response = await httpClient.get<IProduct>(
    `products/.by.slug/${filter.product}?city=${filter?.city}&subCat=${filter.subCategory}`,
  )
  return response
}
