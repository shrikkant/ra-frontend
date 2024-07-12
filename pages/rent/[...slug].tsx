
import React, { useEffect, useState } from 'react'
import { AppLayout } from 'components/AppLayout'
import { useProducts } from 'hooks/useProducts'
import ProductCard from 'components/ProductCard'
import Loader from 'components/Loader';
import ProductFilterNav from 'components/ProductFilterNav';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { getProductFilter } from "util/search.util";
import { useSelector } from 'react-redux';
import { getCategories } from 'app-store/app-defaults/app-defaults.slice';

import { fetchProduct } from 'api/products.api';
import { Product } from 'components/product/Product';
import { IProduct, IProductFilter } from 'app-store/types';
import Custom404 from '../404';


export default function Location() {
  const router = useRouter();
  const { query } = router;
  const [activeProduct, setActiveProduct] = useState<IProduct | null>(null);
  const { products } = useProducts();

  const [filter, setFilter] = useState<IProductFilter>();
  const [pageNotFound, setPageNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = useSelector(getCategories);

  const [filters, setFilters] = useState(false);


  useEffect(() => {
    setLoading(true);

    const queryString = query ? String(query) : "";

    if (queryString) {
      try {
        const filter = categories ? getProductFilter(query, categories) : {};

        if (!filter) {
          setPageNotFound(true);
          return;
        }

        setFilter(filter);

        if (filter.product) {
          fetchProduct(filter).then((product: IProduct) => {
            setActiveProduct(product);
            setLoading(false);
          });
        } else {
          if (products) {
            setLoading(false);
          }
        }
      } catch (error) {
        // some pother shit.
        alert(error);
        setPageNotFound(true)
      }
    }

  }, [query, categories, products]);

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
  };

  if (pageNotFound) {
    return <Custom404></Custom404>
  }


  return (<AppLayout sidebar={false}>
    {loading && <Loader></Loader>}

    {(!filter?.product && products) && (
      <div className="sm:flex ">
        <ProductFilterNav
          onChange={onChange}
          filters={filters}
          toggleFilters={toggleNav}
        ></ProductFilterNav>

        <div>

          <div className="flex justify-end border-b px-1 py-3 sm:hidden">
            <button
              className="px-5 flex justify-end gap-x-2"
              onClick={toggleNav}
            >
              Filters <AdjustmentsHorizontalIcon className="h-6 w-6" />
            </button>

          </div>

          <div
            className={
              "r-comp  px-2 py-4 flex flex-wrap gap-y-5 sm:gap-x-3  "
            }
          >
            {products &&
              products.map((product: any, index) => (
                <ProductCard key={product.id} product={product} priority={index < 24}></ProductCard>
              ))}
          </div>
        </div>
      </div>
    )}

    {(filter?.product && activeProduct) && <Product product={activeProduct}></Product>}
  </AppLayout>
  )
}

