"use server"
import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProducts } from 'api/products.api';

import { fetchData } from '../../../api/axios.config';
import PageContainer from '../../../components/common/PageContainer';

export default async function Location({ params }: { params: { slug: string } }) {
  const categories = await fetchData(`categories`);

  console.log("Params", params);

  const filter = getProductFilter(params, categories) || {};

  const products = await fetchProducts("", filter);



  return (<PageContainer>
    {(!filter?.product && products) && (
      <div className="sm:flex ">
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

  </PageContainer>)
}

