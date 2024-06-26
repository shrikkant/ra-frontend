'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../api/products.api";
import { useLocalStorage } from "../../util/localStore.util";
import Loader from "../Loader";
import HomeProductCard from "./HomeProductCard";
import PageContainer from "../common/PageContainer";



export default function TopSales() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any>([]);
  const [defaultSearch, setDefaultSearch] = useLocalStorage<any>("defaultSearch");



  const loadProducts = (city: string) => {
    setLoading(true);

    getFeaturedProducts(4, city).then((res) => {
      setLoading(false);
      console.log("res", res);
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
    if (!location || !location.city) {
      console.log("Setting default search inside top sales");
      setDefaultSearch({ location: { city: "pune" } });
      loadProducts("pune");
      return;
    }

    loadProducts(defaultSearch?.location?.city);

  }, [router]);

  if (loading) return <Loader></Loader>

  return (<section className="s-top-sale">
    <PageContainer>
      <h2 className="title">Top sales</h2>
      {categories && <div className="flex flex-row product-cover flex-wrap md:gap-x-5 sm:gap-x-5 gap-x-2 justify-center">

        {categories[0]?.products?.map((product: any) => (
          <HomeProductCard key={product.id} product={product}></HomeProductCard>
        ))}

        {categories[1]?.products?.map((product: any) => (
          <HomeProductCard key={product.id} product={product}></HomeProductCard>
        ))}

      </div>}
    </PageContainer>
  </section>)
}
