import AppHeader from "../../components/header";
import { AppFooter } from "../../components/footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchMetaData,
  getSearchResults,
  getSearchResultsAction,
  setSearchMetaData,
  setSearchResults,
} from "../../app-store/products/products.slice";
import Loader from "../../components/Loader";
import { fetchProducts } from "../../api/products.api";
import { useRouter } from "next/router";
import ProductCard from "../../components/ProductCard";
import { getProductFilter } from "../../util/search.util";

import styles from "../../styles/search.module.css";
import ProductFilterNav from "../../components/ProductFilterNav";

import React from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { AppLayout } from "../../components/AppLayout";

export default function RentSearch() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const searchResults = useSelector(getSearchResults);
  const searchMeta = useSelector(getSearchMetaData);

  const [filters, setFilters] = useState(false);

  const toggleNav = () => {
    setFilters(!filters);
  };

  const dispatch = useDispatch();
  const { q } = router.query;

  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
    getSearchResultsAction(
      String(q || ""),
      getProductFilter(query)
    )(dispatch).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    console.log("Fetching <> ", router.query);
    getSearchResultsAction(
      String(q || ""),
      getProductFilter(router.query)
    )(dispatch).then(() => {
      setLoading(false);
    });
  }, [router.query]);

  return (
    <AppLayout>
      {loading && <Loader></Loader>}

      {!loading && (
        <div className="sm:flex">
          <ProductFilterNav
            searchMeta={searchMeta}
            onChange={onChange}
            filters={filters}
            toggleFilters={toggleNav}
          ></ProductFilterNav>

          <div>
            <div className="flex justify-end border-b px-1 py-3">
              <button
                className="px-5 flex justify-end gap-x-2"
                onClick={toggleNav}
              >
                Filters <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
            <div className={"r-comp grid-cols-2 gap-x-2 px-2 py-4 md:grid-cols-3 xl:grid-cols-4 grid gap-y-3"}>
              {searchResults &&
                searchResults.map((product: any) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
