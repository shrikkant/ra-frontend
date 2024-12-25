import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getCategoriesAction } from "../app-store/app-defaults/app-defaults.slice";


export const useCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);

  useEffect(() => {
    if (!categories) {
      getCategoriesAction()(dispatch);
    }
  }, []);

  return { categories };
};
