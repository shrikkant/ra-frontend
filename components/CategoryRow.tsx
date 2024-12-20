
import { Content } from "antd/lib/layout/layout";
import ProductCard from "./ProductCard";
import React from "react";
import { IProduct } from "../app-store/types";

export default function CategoryRow(props: any) {
  return (
    <Content className="r-comp flex  sm:gap-4 flex-wrap p-2">
      {props.category.products.map((product: IProduct) => (
        <ProductCard key={product.id} product={product}></ProductCard>
      ))}
    </Content>
  );
}
