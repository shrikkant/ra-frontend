import { useEffect, useState } from "react";
import {
  getSearchResultsAction,
  getSearchResults,
} from "../app-store/products/products.slice";
import { getProductFilter } from "../util/search.util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../app-store/app-defaults/app-defaults.slice";
import { useLocalStorage } from "../util/localStore.util";

export const useProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query } = router;
  const { q } = query;
  const products = useSelector(getSearchResults);
  const categories = useSelector(getCategories);
  const [defaultSearch, setDefaultSearch] = useLocalStorage<any>(
    "defaultSearch"
  );

  useEffect(() => {
    const queryString = q ? String(q) : "";
    const filter = categories ? getProductFilter(query, categories[0].subCategories) : {};
    filter.city = !filter.city ? defaultSearch?.location?.city : filter.city;

    if (filter && filter.city)  {
      console.log("fetching search results **** ", filter);
      !filter.product && getSearchResultsAction(queryString, filter)(dispatch);
    }

  }, [router.query, categories, defaultSearch]);

  return { products };
};
