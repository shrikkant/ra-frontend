import { Card, Divider, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";
import PriceTag from "./PriceTag";
import React from "react";

export default function ProductCard({ product }) {

  return (

    <Link className="r-comp  sm:w-72" href={"/rent/products/" + product.slug}>

      <Card
        className="r-comp w-full flex justify-between flex-col h-full"
        key={product.id}
        hoverable
        cover={<img alt="example"
          className={"p-5"}
          src={(product.photos[0] ? product.photos[0].path : "/assets/img/no-image.jpeg")} />}
      >
        <Meta title={<div style={{ whiteSpace: 'pre-wrap' }} className="text-sm">{product.title}</div>} />
        <div style={{ width: '100%', margin: '10px 0px' }}></div>
        <Meta description={"Starting"} />
        <Meta title={<PriceTag price={product.rates[0].rate} currency={"INR"} />} />

        <button className="p-2 w-full text-md font-semibold rounded bg-amber-500 text-gray-800" style={{color: "#555", textAlign:"center", marginTop:16}}>
          Book Now
        </button>
      </Card>
    </Link>

  )
}
