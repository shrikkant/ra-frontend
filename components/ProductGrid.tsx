import CategoryRow from "./CategoryRow";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getFeaturedProducts } from "../api/products.api";
import { Content } from "antd/lib/layout/layout";
import React from "react";

import { useRouter } from "next/router";
import { IDefaultSearch } from "../app-store/app-defaults/types";
import { useSelector } from "react-redux";
import { getDefaultSearch } from "../app-store/session/session.slice";


export default function ProductGrid() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const defaultSearch: any = useSelector<IDefaultSearch>(getDefaultSearch)


  const loadProducts = (city: string) => {
    setLoading(true);
    getFeaturedProducts(8, city).then((res: any) => {
      setLoading(false);
      setCategories(res);
    })
      .catch((err) => {
        // Error handling
        setLoading(false);
        console.log(err);
        return null;
      });
  };

  useEffect(() => {
    const city = defaultSearch?.location?.city || "Pune";

    if (!defaultSearch || !defaultSearch.location) {
      router.push("/pune/rent-camera");
    } else {
      loadProducts(city);
    }
  }, [router.isReady]);

  if (loading) return <Loader></Loader>

  return (
    <Content className="r-comp flex flex-col ">
      <CategoryRow key="1" category={categories[0]} />
      <CategoryRow key="2" category={categories[1]} />
      {/* <CategoryRow key="3" category={categories[2]} /> */}
    </Content>
  )
}
