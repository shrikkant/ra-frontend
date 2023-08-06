import CategoryRow from "./CategoryRow";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getFeaturedProducts } from "../api/products.api";
import { Content } from "antd/lib/layout/layout";
import React from "react";


export default function ProductGrid() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

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
    const defaults: any = localStorage.getItem("defaultSearch");
    const location = defaults ? JSON.parse(defaults).location : {city: "Pune"};

    loadProducts(location.city);
  }, []);

  if (loading) return <Loader></Loader>

  return (
    <Content  className="r-comp flex flex-col p-4">
      <CategoryRow key="1" category={categories[0]} />
      <CategoryRow key="2" category={categories[1]} />
      <CategoryRow key="3" category={categories[2]} />
    </Content>
  )
}
