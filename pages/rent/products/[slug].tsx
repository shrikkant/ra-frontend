"use client";
import {
  Card,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductBySlug } from "../../../api/products.api";
import Loader from "../../../components/Loader";

import BookingForm from "../../../components/BookingForm";
import { AppLayout } from "../../../components/AppLayout";
import { HeadCard } from "../../../components/product/HeadCard";
import { Package } from "../../../components/product/Package";
import { Description } from "components/product/Description";

const ProductPage = () => {
  const router = useRouter();

  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);

  const dispatch = useDispatch();

  const loadActiveProduct = () => {
    setLoading(true);
    fetchProductBySlug(String(slug)).then((res) => {
      setLoading(false);
      setActiveProduct(res);
    });
  };

  useEffect(() => {
    router.isReady && loadActiveProduct();
  }, [router.isReady]);

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
          {loading && <Loader></Loader>}

          {!loading && (
            <Content style={{ maxWidth: 1240, margin: "auto" }}>
              <div className={"flex flex-col sm:flex-row"}>
                <div
                  className="sm:w-3/4 w-full">
                  <HeadCard product={activeProduct}></HeadCard>
                  <Package addons={activeProduct.masterProductList}></Package>
                  <Description description={activeProduct?.masterProduct?.description}></Description>
                </div>

                <div className={"sm:w-1/4 w-full"}>
                  <div className="fixed top-100 w-80">
                    <BookingForm rates={activeProduct?.rates}></BookingForm>
                  </div>
                </div>
              </div>
            </Content>
          )}
        </Content>
      </AppLayout>
    )
  );
};

export default ProductPage;
