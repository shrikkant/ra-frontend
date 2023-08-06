import { Card, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import Link from "next/link";
import styles from '../styles/Home.module.css'
import ProductCard from "./ProductCard";
import React from "react";

export default function CategoryRow(props: any) {
  return (

      <Content className="r-comp flex gap-5 flex-wrap">
        {props.category.products.map((product: any) => (
          <ProductCard key={product.id} product={product}></ProductCard>
        ))}
      </Content>
   );
}
