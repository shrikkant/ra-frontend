import React, { useEffect, useState } from 'react'


import { AppLayout } from 'components/AppLayout'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader';
import ProductFilterNav from '../components/ProductFilterNav';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Location() {
  const router = useRouter();
  const { products } = useProducts();


  const [filters, setFilters] = useState(false);

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
  };


  return (
    <AppLayout sidebar={false}>
      {!products && <Loader></Loader>}

      {products && (
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
    </AppLayout>
  )
}
