/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
      <div className="p-4">
        <div className={"flex flex-col sm:flex-row gap-4"}>
          <div className="sm:w-3/5 w-full md:w-3/4">
            <HeadCard product={product}></HeadCard>
            {(addons && addons.length) > 0 &&
              <Package addons={addons}></Package>
            }
            <Description
              description={product?.masterProduct?.description}
            ></Description>
          </div>

          <div className={"sm:w-2/5 w-full flex justify-center md:w-1/4"}>
            <div className="sm:fixed top-100 w-80">

              <BookingForm
                discount={product?.discount_percent}
                rates={rates}
                productId={product.id}>

              </BookingForm>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
