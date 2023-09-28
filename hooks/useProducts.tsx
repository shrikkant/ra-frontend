import { useEffect } from "react";
import {
  getSearchResultsAction,
  getSearchResults,
} from "../app-store/products/products.slice";
import { getProductFilter } from "../util/search.util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ParsedUrlQuery } from "querystring";

export const useProducts = (query: ParsedUrlQuery) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { q } = query;
  const products = useSelector(getSearchResults);

  useEffect(() => {
    const queryString = q ? String(q) : ""
    const filters = getProductFilter(query);
    getSearchResultsAction(queryString, filters)(dispatch);
  }, [router.query]);

  return { products };
};
