import { SliderMarks } from "antd/lib/slider";
import { ParsedUrlQuery } from "querystring";
import COUNTRIES, { CITY } from "../config/constants";
import {
  ICheckboxOption,
  IProductCategory,
  IProductFilter,
  IProductSubCategory,
} from "../app-store/types";


export function getBrandOptions(brands: any): ICheckboxOption[] {
  const options: ICheckboxOption[] = [];

  brands?.map((brand) => {
    const option: ICheckboxOption = { label: brand.name, value: brand.id };
    options.push(option);
  });
  return options;
}

export function getSubCategoryOptions(subCategories: IProductSubCategory[]) {
  const options: ICheckboxOption[] = [];
  subCategories.map((sc) => {
    const option: ICheckboxOption = {
      label: sc.title,
      value: sc.id.toString(),
    };
    options.push(option);
  });

  return options;
}

export function getRateMarks(rate): SliderMarks {
  const marks: SliderMarks = {
    [Math.ceil(rate.min)]: Math.ceil(rate.min),
    [Math.floor(rate.max)]: Math.floor(rate.max),
  };
  return marks;
}

export function getDefaultRateRange(
  min: number,
  max: number,
  range?: string | string[]
): [number, number] {
  if (range) {
    return [
      parseInt(String(range).split("-")[0]),
      parseInt(String(range).split("-")[1]),
    ];
  }
  const m = Math.round(min + ((max - min) * 1) / 3);
  const mu = Math.round(min + ((max - min) * 2) / 3);
  return [m, mu];
}

const getCities = (code: string) => {
  const country = COUNTRIES.find((c) => c.code === code);

  if (!country) {
    return null;
  }

  return country.locations;
}

const getStates = (code: string) => {
  const country = COUNTRIES.find((c) => c.code === code);
  return country.states;
}

const getSubCategoryFromCategories = (slug: string, categories: IProductCategory[]): IProductSubCategory | null => {

  const activeCategory = categories.find((category: IProductCategory) => {
    const active = category.subCategories?.find((sc: IProductSubCategory) => sc.slug === slug);
    return active ? active : null;
  });

  const subCategory = activeCategory?.subCategories?.find((sc: IProductSubCategory) => sc.slug === slug);
  return subCategory ? subCategory : null;
}

const getSubCategoryBySlug = (slug, categories): IProductSubCategory | null => {
  const found = getSubCategoryFromCategories(slug, categories);
  return found;
}

export const getFilterByQueryString = (params: string | string[] | undefined, subCategories: IProductCategory[]) => {
  const productFilter: IProductFilter = {};
  if (!params) {
    return null;
  }

  if (params[0] && params[0].length === 2) {
    // first param is country.
    // TO_DO: Check if the country is valid.
    const country = COUNTRIES.find((c) => c.code === params[0].toUpperCase());
    const city = params[1].charAt(0).toUpperCase() + params[1].slice(1);

    if (!country) {
      return null;
    }

    if (!city) {
      return null;
    }
    console.log(country, " : ", getCities(country.code));
    if (getCities(country.code).includes(city)) {

      productFilter.country = params[0].toLowerCase();
      productFilter.city = params[1].toLowerCase();

      if (params[2]) {
        const subCategory = getSubCategoryBySlug(params[2], subCategories);
        if (!subCategory) {
          return null
        }
        productFilter.subCategory = subCategory.id;
        if (params[3]) {
          productFilter.product = params[3];
        }
      }
    }

  } else if (params[0]) {
    const citySlug = params[0].charAt(0).toUpperCase() + params[0].slice(1);
    const city = getCities("IN").find((city: string) => city === citySlug);
    const state = getStates("IN").find((state: string) => state === citySlug);

    if (!city && !state) {
      return null;
    }

    if (city) {
      productFilter.city = city.toLowerCase();
    }

    if (state) {
      productFilter.state = state.toLowerCase();
    }


    if (params[1]) {
      const subCategory = getSubCategoryBySlug(params[1], subCategories);
      if (!subCategory) {
        return null;
      }
      productFilter.subCategory = getSubCategoryBySlug(params[1], subCategories)?.id;
    }


    if (params.length > 2) {
      productFilter.product = params[2];
    }

  }

  return productFilter;
}



export function getProductFilter(obj: ParsedUrlQuery, categories: IProductCategory[]) {
  const { slug } = obj;

  const productFilter: IProductFilter | null = getFilterByQueryString(slug, categories);

  if (!productFilter) {
    return null;
  }

  if (obj?.rf) {
    productFilter.rate = [
      parseInt(String(obj.rf).split("-")[0]),
      parseInt(String(obj.rf).split("-")[1]),
    ];
  }

  if (obj?.page) {
    productFilter.page = parseInt(String(obj.page)) - 1;
  }

  if (obj?.br) {
    productFilter.brand = [];
    String(obj.br)
      .split(",")
      .map((brand) => productFilter.brand?.push(parseInt(brand)));
  }


  return productFilter;
}
