import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProductBySlug, fetchProducts } from 'api/products.api';

import { fetchData } from 'api/axios.config';
import { Product } from 'components/product/Product';
import FilterSideBar from 'components/rent/FilterSideBar';
import { IProduct } from '../../app-store/types';

export default async function Location({ params, searchParams }: { params: { slug: string }, searchParams }) {
  const categories = await fetchData(`categories`);
  const filter = getProductFilter(params, categories) || {};
  let product: IProduct | null = null;
  let products: IProduct[] = [];
  let meta;



  // const [meta, setMeta] = React.useState<any>(null);

  if (filter.product) {
    const productSlug = params.slug.toString().split(",").at(-1);
    product = productSlug ? await fetchProductBySlug(productSlug) : null;
  } else {
    const response: { results: IProduct[], meta: any } = await fetchProducts(searchParams?.q, filter);
    products = response.results;
    // meta = response.meta;
  }

  return (<div style={{ maxWidth: 1280, margin: "auto" }}>
    {(!filter?.product && products) && (<>
      <h1 className='text-4xl text-center py-6 capitalize font-semibold'>Rent Cameras, Lenses, GoPro&apos;s  in {filter?.city}</h1>
      <div className=''>
        {/* <FilterSideBar searchMeta={meta} filter={filter}></FilterSideBar> */}
        <div className={"grid lg:grid-cols-4 md:grid-cols-3 gap-2 xs:grid-cols-2"}>
          {products &&
            products.map((product: any, index) => (
              <ProductCard key={product.id} product={product} priority={index < 24}></ProductCard>
            ))}
        </div>
      </div>
    </>)}
    {(filter?.product && product) && <Product product={product}></Product>}

  </div>)
}

