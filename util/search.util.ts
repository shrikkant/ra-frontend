import { SliderMarks } from "antd/lib/slider";
import { ParsedUrlQuery } from "querystring";
import { CITY } from "../config/constants";
import { ICheckboxOption, IProduct, IProductFilter, IProductSubCategory } from "../app-store/types";

export function getBrandOptions(brands: any): ICheckboxOption[] {
  let options: ICheckboxOption[] = [];

  brands?.map((brand) => {
    const option: ICheckboxOption = { label: brand.name, value: brand.id };
    options.push(option);
  })
  return options;
}

export function getSubCategoryOptions(subCategories: IProductSubCategory[]) {
  let options: ICheckboxOption[] = [];
  subCategories.map((sc) => {
    const option: ICheckboxOption = { label: sc.title, value: sc.id.toString() };
    options.push(option);
  })

  return options;
}

export function getRateMarks(rate): SliderMarks {
  const marks: SliderMarks = {
    [Math.ceil(rate.min)]: Math.ceil(rate.min),
    [Math.floor(rate.max)]: Math.floor(rate.max)
  }
  return marks
}

export function getDefaultRateRange(min: number,
  max: number,
  range?: string | string []): [number, number] {
    console.log("RANGE > ", range);
  if (range) {
    return [parseInt(range.split("-")[0]), parseInt(range.split("-")[1])];
  }
  const m = Math.round(min + ((max - min) * 1 / 3));
  const mu = Math.round(min + (max - min) * 2 / 3);
  return [m, mu];
}

export function getProductFilter(obj?: ParsedUrlQuery) {
  const productFilter: IProductFilter = {};
  productFilter.city = CITY;

  if (obj?.scid) {
    productFilter.subCategory = parseInt(obj.scid);
  }

  if (obj?.rf) {
    productFilter.rate = [obj.rf.split("-")[0], obj.rf.split("-")[1]]
  }

  if (obj?.page) {
    productFilter.page = parseInt(obj.page)-1;
  }

  if (obj?.br) {
    productFilter.brand = [];
    obj.br.split(",").map((brand) => productFilter.brand?.push(brand));
  }

  return productFilter;

}
