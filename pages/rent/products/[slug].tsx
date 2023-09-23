"use client";
import { Card } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import React from "react";
import Loader from "../../../components/Loader";
import { AppLayout } from "../../../components/AppLayout";

import { useActiveProduct } from "../../../hooks/useActiveProduct";
import { Product } from "../../../components/product/Product";

const ProductPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { activeProduct } = useActiveProduct(slug);
  return (
    activeProduct && (
      <AppLayout sidebar={false}>

        <Content
          style={{
            background: "#fff",
            minHeight: "100vh",
            display: "flex",
            paddingTop: 100,
          }}
        >
          {!activeProduct && <Loader></Loader>}

          {activeProduct && (
              <Product product={activeProduct}></Product>
          )}
        </Content>
      </AppLayout>
    )
  );
};

export default ProductPage;
