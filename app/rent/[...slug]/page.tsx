import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProductBySlug, fetchProducts } from 'api/products.api';

import { fetchData } from '../../../api/axios.config';
import PageContainer from '../../../components/common/PageContainer';
import { Product } from '../../../components/product/Product';
import { IProduct } from '../../../app-store/types';
import FilterSideBar from '../../../components/rent/FilterSideBar';

export default async function Location({ params, searchParams }: { params: { slug: string }, searchParams }) {
  const categories = await fetchData(`categories`);

  console.log("Params : ", searchParams);
  const filter = getProductFilter(params, categories) || {};



  let product: IProduct = null;
  let products = null;
  let meta = null;

  if (filter.product) {
    product = await fetchProductBySlug(filter.product);
  } else {
    const response = await fetchProducts(searchParams?.q, filter);
    products = response.results;
    meta = response.meta;
  }







  return (<PageContainer>
    {(!filter?.product && products) && (
      <div className="sm:flex ">
        <FilterSideBar searchMeta={meta} params={null}></FilterSideBar>
        <div
          className={
            "r-comp  px-2 py-4 grid sm:flex  flex-wrap gap-y-5 gap-x-3 "
          }
        >
          {products &&
            products.map((product: any, index) => (
              <ProductCard key={product.id} product={product} priority={index < 24}></ProductCard>
            ))}
        </div>

      </div>
    )}
    {(filter?.product && product) && <Product product={product}></Product>}

  </PageContainer>)
}

