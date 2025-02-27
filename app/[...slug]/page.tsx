/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProductBySlug, fetchProducts } from 'api/products.api';


import { Product } from 'components/product/Product';
import { IProduct } from '../../app-store/types';
import { fetchData } from '../utils/api';
import FilterSideBar from '../../components/rent/FilterSideBar';

import { notFound } from 'next/navigation';
// type PageProps<TParams extends Record<string, any> = object, TSearchParams extends Record<string, any> = object> = {
//   params: TParams; // Dynamic route parameters
//   searchParams: TSearchParams; // Query string parameters
// };

interface PageProps {
  params: any;
  searchParams: any;
}

export default async function Page({ params, searchParams }: PageProps) {
  const categories = await fetchData(`categories`);
  const localParams = await params;
  const localSearchParams = await searchParams;
  const filter = getProductFilter(localParams, categories);
  let product: IProduct | null = null;
  let products: IProduct[] = [];
  let meta: any = null;

  // const [meta, setMeta] = React.useState<any>(null);

  if (filter && filter.product) {
    const productSlug = localParams.slug.toString().split(",").at(-1);
    product = productSlug ? await fetchProductBySlug(productSlug) : null;
  } else {
    const response: { results: IProduct[], meta } = await fetchProducts(localSearchParams?.q, filter);
    products = response.results;
    meta = response.meta;
  }

  console.log("Filter: ", filter);
  if (!filter || (filter && !filter.city)) {
    return notFound();
  }
  return (<div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
    {!filter?.product && <h1 className="text-4xl text-center py-6 capitalize font-semibold">
      Rent Cameras, Lenses, GoPro&apos;s in {filter?.city}
    </h1>}
    {(!filter?.product && products) &&
      (<>
        <FilterSideBar searchMeta={meta} filter={filter}></FilterSideBar>
        <div className={"grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 pb-4"}>
          {products &&
            products.map((product: IProduct) => (
              <ProductCard key={product.id} product={product}></ProductCard>
            ))}
        </div>
      </>)
    }
    {(filter?.product && product) &&
      <Product product={product}></Product>
    }

  </div>)
}

