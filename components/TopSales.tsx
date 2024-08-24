import React from "react";

import HomeProductCard from "components/home/HomeProductCard";
import PageContainer from "./common/PageContainer";
import { IProduct } from "../app-store/types";



export default function TopSales({ categories }) {


  return (<section className="s-top-sale">
    <PageContainer>
      <h2 className="title">Top sales</h2>
      {categories && <div className=" product-cover grid md:grid-cols-4 gap-2 md:gap-4 lg:grid-cols-5 xs:grid-cols-2">

        {categories[0]?.products?.map((product: IProduct) => (
          <HomeProductCard key={product.id} product={product}></HomeProductCard>
        ))}

        {categories[1]?.products?.map((product: IProduct) => (
          <HomeProductCard key={product.id} product={product}></HomeProductCard>
        ))}

      </div>}
    </PageContainer>
  </section>)
}
