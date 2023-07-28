import { Layout, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../components/AppNav";
import { AppFooter } from "../components/footer";
import AppHeader from "../components/header";

import {
  getMyProducts,
  setProducts,
} from "../app-store/user/products/products.slice";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../api/user/products.api";
import MyPageHeader from "../components/MyPageHeader";

import ProductRow from "../components/ProductRow";
import React from "react";
import { AppLayout } from "../components/AppLayout";

export default function MyProducts() {
  const products = useSelector(getMyProducts);
  const dispatch = useDispatch();

  if (!products) {
    getProducts().then((data) => {
      dispatch(setProducts(data));
    });
  }

  return (
    <AppLayout>
      <MyPageHeader
        title="My Products"
        subtitle="Your gear listing"
      ></MyPageHeader>

      <Content style={{ padding: "16px 24px" }}>
        <Space size={[10, 20]} direction="vertical">
          {products &&
            products.map((product: any) => (
              <ProductRow key={product.id} product={product}></ProductRow>
            ))}
        </Space>
      </Content>
    </AppLayout>
  );
}
