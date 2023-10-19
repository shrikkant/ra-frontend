import CategoryRow from "./CategoryRow";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getFeaturedProducts } from "../api/products.api";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import { useLocalStorage } from "../util/localStore.util";
import { useCategories } from "../hooks/useCategories";
import { useRouter } from "next/router";


export default function ProductGrid() {
  const searchDefaults = {
    location: {
      lat: 18.5788913,
      lng: 73.7706807,
      city: "Pune",
    },
  };

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [defaultSearch, setDefaultSearch] = useLocalStorage<any>("defaultSearch", searchDefaults);


  const loadProducts = (city: string) => {
    setLoading(true);
    getFeaturedProducts(8, city).then((res) => {
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

    const location: any = defaultSearch?.location;

    location && loadProducts(location.city);
  }, [router.isReady]);

  if (loading) return <Loader></Loader>

  return (
    <Content className="r-comp flex flex-col ">
      <CategoryRow key="1" category={categories[0]} />
      <CategoryRow key="2" category={categories[1]} />
      <CategoryRow key="3" category={categories[2]} />
    </Content>
  )
}
