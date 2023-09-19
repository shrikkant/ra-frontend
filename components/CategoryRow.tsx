
import { Content } from "antd/lib/layout/layout";
import ProductCard from "./ProductCard";
import React from "react";

export default function CategoryRow(props: any) {
  return (
      <Content className="r-comp flex gap-1 sm:gap-4 flex-wrap p-2">
        {props.category.products.map((product: any) => (
          <ProductCard key={product.id} product={product} priority={true}></ProductCard>
        ))}
      </Content>
   );
}
