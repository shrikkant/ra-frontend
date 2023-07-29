import { Card, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import Link from "next/link";
import styles from '../styles/Home.module.css'
import ProductCard from "./ProductCard";
import React from "react";

export default function CategoryRow(props: any) {
  return (

      <Content className="r-comp grid-cols-2 gap-x-2 px-2 py-4 md:grid-cols-3 xl:grid-cols-4 gap-y-2 grid">
        {props.category.products.map((product: any) => (
          <ProductCard key={product.id} product={product}></ProductCard>
        ))}
      </Content>
   );
}
