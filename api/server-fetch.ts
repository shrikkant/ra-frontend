import {ENV_CONFIG} from '../config/environment'
import {
  IProduct,
  IProductCategory,
  IProductFilter,
  ProductPhoto,
} from '../app-store/types'

// Server-side fetch function for static generation
export const fetchDataServer = async (url: string, customOptions?: any) => {
  console.log('Server URL > ', ENV_CONFIG.SERVER_API_BASE_URL)
  const commonOptions = {
    headers: {'Content-Type': 'application/json'},
    cache: 'force-cache',
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  console.log('Server URL > ', `${ENV_CONFIG.SERVER_API_BASE_URL}${url}`)

  try {
    const response: any = await fetch(
      `${ENV_CONFIG.SERVER_API_BASE_URL}${url}`,
      options,
    )
    // if (!response.ok) {
    //   throw new Error('Failed to fetch data')
    // }

    const {resultFormatted} = await response.json()

    return resultFormatted
  } catch (error) {
    console.log('Error > ', error)
  }
}

// Server-side product functions
export async function getFeaturedProductsServer(
  pageLimit: number,
  city: string,
): Promise<any[]> {
  const response = await fetchDataServer(
    `getFeaturedProducts?pageLimit=${pageLimit}&city=${city}`,
  )
  return response
}

export async function fetchProductCategoriesServer(): Promise<
  IProductCategory[]
> {
  const response = await fetchDataServer(`categories`)
  return response
}

export async function fetchProductsServer(
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

  return fetchDataServer(url)
}

export async function fetchProductBySlugServer(
  slug: string,
): Promise<IProduct> {
  const response = await fetchDataServer(`products/.by.slug/${slug}`)
  return response
}

// Server-side blog functions
export async function fetchBlogsServer(
  page: number,
  limit?: number,
  type?: number,
): Promise<any> {
  const res = await fetchDataServer(
    `blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`,
  )
  return res
}

export async function fetchBlogBySlugServer(slug: string): Promise<any> {
  const res = await fetchDataServer(`blog/.by.slug/${slug}`)
  return res
}
