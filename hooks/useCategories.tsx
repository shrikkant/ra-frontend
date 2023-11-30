import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getCategoriesAction, setCategories } from "../app-store/app-defaults/app-defaults.slice";


export const useCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);

  useEffect(() => {
    !categories && getCategoriesAction()(dispatch);
  }, []);

  return { categories };
};
