import { fetchProducts } from "../api/products.api"
import { useEffect, useState } from "react";
import { IProduct } from "../app-store/types";
import { getSearchResultsAction, getSearchResults } from "../app-store/products/products.slice";
import { getProductFilter } from "../util/search.util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";


export const useProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { q } = router.query;
  const products =  useSelector(getSearchResults);

  useEffect(() => {

    console.log("Using Effect!");

    getSearchResultsAction(
      String(q || ""),
      getProductFilter(router.query)
    )(dispatch);
  }, [router.query])

  return { products };
}

