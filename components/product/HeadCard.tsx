"use client"

import {
  Card,
  Divider,

} from "antd";
import Meta from "antd/lib/card/Meta";
import { IProduct } from "../../app-store/types";
import LocationShort from "../LocationShort";
import React, { useState } from "react";

interface ProductProps {
  product: IProduct;
}

export const HeadCard: React.FC<ProductProps> = ({ product }: ProductProps) => {

  const photo = product.masterPhotos ? product.masterPhotos[0] : null;
  return (
    <div>

      <div className="w-full flex flex-col justify-center items-center pb-4">
        <div>
          {photo?.image_data &&
            <div className="flex justify-center">
              <img className={"sm:max-w-[540px]"} src={`data:image/png;base64,${photo.image_data}`}></img>
            </div>
          }
        </div>

      </div>
      <h1 className="text-xl font-bold">{product.title}</h1>
    </div>
  );
};
