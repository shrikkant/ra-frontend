/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import React from 'react'
import ProductCard from 'components/ProductCard'

import { getProductFilter } from "util/search.util";
import { fetchProductBySlug, fetchProducts } from 'api/products.api';


import { Product } from 'components/product/Product';
import { IProduct } from '../../app-store/types';
import { fetchData } from '../utils/api';
import FilterSideBar from '../../components/rent/FilterSideBar';

import { notFound } from 'next/navigation';

import { capitalize } from "../../util/global.util";
// type PageProps<TParams extends Record<string, any> = object, TSearchParams extends Record<string, any> = object> = {
//   params: TParams; // Dynamic route parameters
//   searchParams: TSearchParams; // Query string parameters
// };

interface PageProps {
  params: any;
  searchParams: any;
}

interface IOpenImage {
  url: string,
  alt: string,
}

interface IMetadata {
  title: string,
  description: string
  openGraph?: {
    title: string,
    description: string,
    url: string,
    siteName: string,
    images: IOpenImage[],
    type: string,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const metadata: IMetadata = {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      "Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. " +
      "Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!"
  }

  const categories = await fetchData(`categories`);
  const localParams = await params;

  const filter = getProductFilter(localParams, categories);

  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(",").at(-1);
      const product = productSlug ? await fetchProductBySlug(productSlug) : null;
      const title = "Rent " + product?.title;
      const description = "Rent " + productSlug + " in " + filter.city + " at most affordable rates." +
        "Hasslefree camera rental. Doorstep delivery & Pickup. Zero Deposit. ";

      metadata.title = title;
      metadata.description = description;
      metadata.openGraph = {
        title,
        description,
        url: `https://www.rentacross.com/${localParams.slug.join("/")}`,
        images: [
          {
            url: `https://www.rentacross.com/api/products/${product?.master_product_id}/photo`,
            alt: title
          }
        ],
        type: "website",
        siteName: "RentAcross"

      }
    } else {
      if (filter.subCategory) {
        metadata.title = capitalize(localParams.slug[1]);
      }
    }

    if (filter.city) {
      metadata.title = metadata.title + " | " + capitalize(localParams.slug[0]);
    }
  }

  return metadata;
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
  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(",").at(-1);
      product = productSlug ? await fetchProductBySlug(productSlug) : null;
    } else {
      const response: { results: IProduct[], meta } = await fetchProducts(localSearchParams?.q, filter);
      products = response.results;
      meta = response.meta;
    }
  }

  if (!filter || (filter && !filter.city)) {
    return notFound();
  }

  return (<div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
    {!filter?.product &&
      <h1 className="text-4xl text-center py-6 capitalize font-semibold">
        Rent Cameras, Lenses, GoPro&apos;s in {filter?.city}
      </h1>
    }

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

