import { fetchProductBySlug, fetchProducts } from "../api/products.api";
import { useEffect, useState } from "react";
import { IProduct } from "../app-store/types";

export const useActiveProduct = (
  slug: string | string[]
): { activeProduct: IProduct } => {
  const [activeProduct, setActiveProduct] = useState<any>(null);
  useEffect(() => {
    fetchProductBySlug(String(slug)).then((res) => {
      setActiveProduct(res);
    });
  });

  return { activeProduct };
};
