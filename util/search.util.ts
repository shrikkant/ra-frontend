import { SliderMarks } from "antd/lib/slider";
import { ParsedUrlQuery } from "querystring";
import COUNTRIES, { CITY } from "../config/constants";
import {
  ICheckboxOption,
  IProduct,
  IProductFilter,
  IProductSubCategory,
} from "../app-store/types";
import { useSelector } from "react-redux";
import { getCategories } from "../app-store/app-defaults/app-defaults.slice";
import { sub } from "date-fns";

export function getBrandOptions(brands: any): ICheckboxOption[] {
  let options: ICheckboxOption[] = [];

  brands?.map((brand) => {
    const option: ICheckboxOption = { label: brand.name, value: brand.id };
    options.push(option);
  });
  return options;
}

export function getSubCategoryOptions(subCategories: IProductSubCategory[]) {
  let options: ICheckboxOption[] = [];
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
  return country.locations;
}

const getStates = (code: string) => {
  const country = COUNTRIES.find((c) => c.code === code);
  return country.states;
}

const getSubCategoryBySlug = (slug, subCategories): IProductSubCategory => {
  return slug ? subCategories.find((scat) => scat.slug === slug) : subCategories[0];
}

const getFilterByQueryString = (params: string | string[], subCategories: IProductSubCategory[]) => {
  const productFilter: IProductFilter = {};
  if (!params) {
    return productFilter;
  }

  if (params[0] && params[0].length === 2) {
    // first param is country.

    const city = params[1].charAt(0).toUpperCase() + params[1].slice(1);

    productFilter.country = params[0].toLowerCase();

    if (
      productFilter.country !== "in" &&
      getCities(params[0].toUpperCase()).includes(city)
    ) {
      productFilter.city = params[1].toLowerCase();

      productFilter.subCategory = params[2] ? getSubCategoryBySlug(params[2], subCategories).id : -1;

      if (params.length > 3) {
        productFilter.product = params[3];
      }
    }
  } else if (params[0]) {
    const city = params[0].charAt(0).toUpperCase() + params[0].slice(1);

    if (getStates("IN").includes(city)) {
      productFilter.state = params[0].toLowerCase();
    } else if (getCities("IN").includes(city)) {
      productFilter.city = params[0].toLowerCase();
    }

    productFilter.subCategory = getSubCategoryBySlug(params[1], subCategories)?.id;

    if (params.length > 2) {
      productFilter.product = params[2];
    }

  }

  if (productFilter.city && !productFilter.subCategory) {
    productFilter.subCategory = subCategories[0].id;
  }


  return productFilter;
}

export function getProductFilter(obj: ParsedUrlQuery, subCategories: IProductSubCategory[]) {
  const { slug } = obj;

  const productFilter: IProductFilter = getFilterByQueryString(slug, subCategories)

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

  console.log("Product Filter : ", productFilter);
  return productFilter;
}
