import React from "react";
import { Content } from "antd/lib/layout/layout";
import { HeadCard } from "./HeadCard";
import { Package } from "./Package";
import { Description } from "./Description";
import BookingForm from "../BookingForm";
import { IProduct } from "../../app-store/types";

export const Product = ({ product }: { product: IProduct }) => {
  const addons: any = product?.masterProductList;
  const rates: any = product?.rates;
  return (
    <>
      <Content style={{ maxWidth: 1240, margin: "auto" }} className={"pt-5"}>
        <div className={"flex flex-col sm:flex-row gap-5"}>
          <div className="sm:w-3/4 w-full">
            <HeadCard product={product}></HeadCard>
            <Package addons={addons}></Package>
            <Description
              description={product?.masterProduct?.description}
            ></Description>
          </div>

          <div className={"sm:w-1/4 w-full"}>
            <div className="sm:fixed top-100 w-80">
              <BookingForm
                discount={product?.discount_percent}
                rates={rates}
                productId={product.id}
              ></BookingForm>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
};
