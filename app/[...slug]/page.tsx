import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProductBySlug, fetchProducts } from 'api/products.api';

import { fetchData } from 'api/axios.config';
import { Product } from 'components/product/Product';
import { IProduct } from '../../app-store/types';

export default async function Location({ params, searchParams }: { params: { slug: string }, searchParams }) {
  const categories = await fetchData(`categories`);
  const localParams = await params;
  const localSearchParams = await searchParams;
  const filter = getProductFilter(localParams, categories) || {};
  let product: IProduct | null = null;
  let products: IProduct[] = [];




  // const [meta, setMeta] = React.useState<any>(null);

  if (filter.product) {
    const productSlug = localParams.slug.toString().split(",").at(-1);
    product = productSlug ? await fetchProductBySlug(productSlug) : null;
  } else {
    const response: { results: IProduct[], meta: any } = await fetchProducts(localSearchParams?.q, filter);
    products = response.results;
    // meta = response.meta;
  }

  return (<div style={{ maxWidth: 1280, margin: "auto" }}>
    {(!filter?.product && products) &&
      (<>
        <h1 className="text-4xl text-center py-6 capitalize font-semibold">
          Rent Cameras, Lenses, GoPro&apos;s  in {filter?.city}
        </h1>

        {/* <FilterSideBar searchMeta={meta} filter={filter}></FilterSideBar> */}
        <div className={"grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 px-2 pb-4"}>
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

