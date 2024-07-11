import React from "react";

import HomeProductCard from "components/home/HomeProductCard";
import PageContainer from "./common/PageContainer";



export default function TopSales({ categories }) {


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
