import React from "react";

import HomeProductCard from "components/home/HomeProductCard";
import PageContainer from "./common/PageContainer";



export default function TopSales({ categories }) {


  return (<section className="s-top-sale">
    <PageContainer>
      <h2 className="title">Top sales</h2>
      {categories && <div className=" product-cover grid lg:grid-cols-4 gap-4 xs:grid-cols-2">

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
