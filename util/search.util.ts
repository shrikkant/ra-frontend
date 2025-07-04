/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SliderMarks } from "antd/lib/slider";
import {ParsedUrlQuery} from 'querystring'
import COUNTRIES from '../config/constants'
import {
  ICheckboxOption,
  IProductCategory,
  IProductFilter,
  IProductSubCategory,
} from '../app-store/types'
import {ReadonlyURLSearchParams} from 'next/navigation'

export function getBrandOptions(brands, selected?): ICheckboxOption[] {
  const options: ICheckboxOption[] = []
  const selectedBrands = selected?.split(',').map(s => parseInt(s))

  brands?.map(brand => {
    const option: ICheckboxOption = {label: brand.name, value: brand.id}
    option.checked = selectedBrands?.includes(brand.id) || false
    options.push(option)
  })

  return options
}

export function getSubCategoryOptions(subCategories: IProductSubCategory[]) {
  const options: ICheckboxOption[] = []
  subCategories.map(sc => {
    const option: ICheckboxOption = {
      label: sc.title,
      value: sc.id?.toString() || '',
    }
    options.push(option)
  })

  return options
}

export function getRateMarks(rate): any[] {
  const marks: any = {
    [Math.ceil(rate.min)]: Math.ceil(rate.min),
    [Math.floor(rate.max)]: Math.floor(rate.max),
  }
  return marks
}

export function getDefaultRateRange(
  min: number,
  max: number,
  range?: string | string[],
): [number, number] {
  if (range) {
    return [
      parseInt(String(range).split('-')[0]),
      parseInt(String(range).split('-')[1]),
    ]
  }
  const m = Math.round(min + ((max - min) * 1) / 3)
  const mu = Math.round(min + ((max - min) * 2) / 3)
  return [m, mu]
}

const getCities = (code: string) => {
  const country = COUNTRIES.find(c => c.code === code)

  if (!country) {
    return []
  }

  return country.locations
}

const getStates = (code: string) => {
  const country = COUNTRIES.find(c => c.code === code)
  return country ? country.states : []
}

function capitalize(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getSubCategoryFromCategories = (
  slug: string,
  categories: IProductCategory[],
): IProductSubCategory | null => {
  const activeCategory = categories.find((category: IProductCategory) => {
    const active = category.subCategories?.find(
      (sc: IProductSubCategory) => sc.slug === slug,
    )
    return active
  })

  const subCategory = activeCategory?.subCategories?.find(
    (sc: IProductSubCategory) => sc.slug === slug,
  )
  return subCategory ? subCategory : null
}

const getSubCategoryBySlug = (slug, categories): IProductSubCategory | null => {
  const found = getSubCategoryFromCategories(slug, categories)
  return found
}

export const getFilterByQueryString = (
  params: string | string[] | undefined,
  subCategories: IProductCategory[],
) => {
  const productFilter: IProductFilter = {}
  if (!params) {
    return null
  }

  if (params[0] && params[0].length === 2) {
    // first param is country.
    // TO_DO: Check if the country is valid.
    const country = COUNTRIES.find(c => c.code === params[0].toUpperCase())
    const city = capitalize(params[1])

    if (!country) {
      return null
    }

    if (!city) {
      return null
    }

    const cities = getCities(country.code)
    if (cities && cities.includes(city)) {
      productFilter.country = params[0].toLowerCase()
      productFilter.city = params[1].toLowerCase()

      if (params[2]) {
        const subCategory = getSubCategoryBySlug(params[2], subCategories)
        if (!subCategory) {
          return null
        }
        productFilter.subCategory = subCategory.id
        if (params[3]) {
          productFilter.product = params[3]
        }
      }
    }
  } else if (params[0]) {
    const citySlug = capitalize(params[0])

    const city = getCities('IN').find((city: string) => city === citySlug)
    const state = getStates('IN').find((state: string) => state === citySlug)

    if (!city && !state) {
      return null
    }

    if (city) {
      productFilter.city =
        city.toLowerCase() === 'bangalore' ? 'bengaluru' : city.toLowerCase()
    }

    if (state) {
      productFilter.state = state.toLowerCase()
    }

    if (params[1]) {
      const subCategory = getSubCategoryBySlug(params[1], subCategories)
      if (!subCategory) {
        return null
      }
      productFilter.subCategory = getSubCategoryBySlug(
        params[1],
        subCategories,
      )?.id
    }

    if (params.length > 2) {
      productFilter.product = params[2]
    }
  }
  return productFilter
}

/**
 * Transforms city names for display purposes
 * Handles special cases like 'bengaluru' -> 'Bangalore'
 * @param city - The city name to transform
 * @returns The transformed city name with proper capitalization
 */
export const locationCity = (city: string, slug: boolean = false): string => {
  const cityName = city.toLowerCase() === 'bengaluru' ? 'Bangalore' : city
  return slug
    ? cityName.toLowerCase()
    : cityName.slice(0, 1).toUpperCase() + cityName.slice(1)
}

export const paramsToObject = (params: ReadonlyURLSearchParams | null) => {
  if (!params) {
    return {}
  }

  const entries = params.entries()
  const result = {}

  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value
  }
  return result
}

export function getProductFilter(
  obj: ParsedUrlQuery,
  categories: IProductCategory[],
) {
  const {slug} = obj
  const productFilter: IProductFilter | null = getFilterByQueryString(
    slug,
    categories,
  )

  if (!productFilter) {
    return null
  }

  if (obj?.rf) {
    productFilter.rate = [
      parseInt(String(obj.rf).split('-')[0]),
      parseInt(String(obj.rf).split('-')[1]),
    ]
  }

  if (obj?.page) {
    productFilter.page = parseInt(String(obj.page)) - 1
  }

  if (obj?.br) {
    productFilter.brand = []
    String(obj.br)
      .split(',')
      .map(brand => productFilter.brand?.push(parseInt(brand)))
  }

  console.log('Filter <> ', productFilter)
  return productFilter
}
