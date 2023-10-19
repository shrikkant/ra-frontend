import { useEffect, useState } from "react";
import {
  getSearchResultsAction,
  getSearchResults,
} from "../app-store/products/products.slice";
import { getProductFilter } from "../util/search.util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../app-store/app-defaults/app-defaults.slice";

export const useProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query } = router;
  const { q } = query;
  const products = useSelector(getSearchResults);
  const categories = useSelector(getCategories);

  useEffect(() => {
    console.log(" Categories : ", categories ? categories : " Null");
    const queryString = q ? String(q) : ""
    const filters = categories ? getProductFilter(query, categories[0].subCategories) : {};

    console.log("Filters ? ", filters);
    if (filters) {
      getSearchResultsAction(queryString, filters)(dispatch);
    }

  }, [categories]);

  return { products };
};
