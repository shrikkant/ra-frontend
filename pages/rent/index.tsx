
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getSearchMetaData,
} from "../../app-store/products/products.slice";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";
import ProductCard from "../../components/ProductCard";

import ProductFilterNav from "../../components/ProductFilterNav";

import React from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { AppLayout } from "../../components/AppLayout";
import { useProducts } from "../../hooks/useProducts";

export default function RentSearch() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  const [filters, setFilters] = useState(false);

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
  };

  useEffect(() => {
    setLoading(!(products && products.length > 0));
  })


  return (
    <AppLayout sidebar={false}>
      {loading && <Loader></Loader>}

      {!loading && (
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
                products.map((product: any) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
