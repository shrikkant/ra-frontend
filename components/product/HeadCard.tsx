"use client"

import {
  Card,
  Carousel,
  Divider,

} from "antd";
import Meta from "antd/lib/card/Meta";
import { IProduct } from "../../app-store/types";
import LocationShort from "../LocationShort";
import { CarouselRef } from 'antd/lib/carousel'
import React, { useState } from "react";

interface ProductProps {
  product: IProduct;
}

export const HeadCard: React.FC<ProductProps> = ({ product }: ProductProps) => {
  const carouselRef = React.createRef<CarouselRef>();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (current: number) => {
    carouselRef.current?.goTo(current);
    setActiveSlide(current);
  }

  return (
    <Card>
      <Meta
        title={product.title}
        description={
          <LocationShort location={product.location}></LocationShort>
        }
      ></Meta>
      <Divider />
      <div className="w-full flex flex-col justify-center items-center">
        <div>
          <Carousel dotPosition={"left"} ref={carouselRef}>

            {product.masterPhotos &&
              product.masterPhotos.map((photo, i) => {
                return (
                  <div key={photo.id} >
                    <div className="flex justify-center">
                      <img className={"max-w-[540px]"} src={`data:image/png;base64,${photo.image_data}`}></img>
                    </div>
                  </div>
                );
              })}
          </Carousel>
        </div>
        <div className={"flex gap-2 pt-4"}>
          {product.masterPhotos &&
            product.masterPhotos.map((photo, index) => {
              return (
                <div
                  key={index}
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => {
                    handleSlideChange(index);
                  }}
                  className={`border-2 w-24 p-2 flex justify-center ${activeSlide === index ? "border-amber-500" : ""}`}
                >
                  <img
                    style={{ width: 64, height: "auto" }}
                    src={`data:image/png;base64,${photo.image_data}`}
                  ></img>
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
};
