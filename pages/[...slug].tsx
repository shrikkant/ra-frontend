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
import { useActiveProduct } from 'hooks/useActiveProduct';
import { fetchProduct, fetchProductBySlug } from 'api/products.api';
import { Product } from 'components/product/Product';
import { IProductFilter } from 'app-store/types';

import { notFound } from 'next/navigation'
import Custom404 from './404';

export default function Location() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState(null);
  const { products } = useProducts();
  const { query } = router;
  const [filter, setFilter] = useState<IProductFilter>();
  const q = query.q;
  const [pageNotFound, setPageNotFound] = useState(false);

  const categories = useSelector(getCategories);

  const [filters, setFilters] = useState(false);

  useEffect(() => {

    const queryString = router.query ? String(router.query.q) : "";

    if (queryString) {
      const filter = categories ? getProductFilter(query, categories[0].subCategories) : {};

      if (!filter.subCategory || !filter.city) {
        setPageNotFound(true);
        return;
      }

      setFilter(filter);

      if (filter.product) {
        fetchProduct(filter).then((product) => {
          setActiveProduct(product);
        });
      }
    }
  }, [categories, router.query]);

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
  };

  if (pageNotFound) {
    return Custom404();
  }

  return (<AppLayout sidebar={false}>
      {!(products || activeProduct) && <Loader></Loader>}

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
                "r-comp  px-2 py-4 grid sm:flex flex-wrap gap-y-5 gap-x-3 grid-cols-2"
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
