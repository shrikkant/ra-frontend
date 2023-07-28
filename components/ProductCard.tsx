import { Card, Divider, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";
import PriceTag from "./PriceTag";
import React from "react";

const cardCover = {
  maxHeight: '180px',
  width: 'auto',
  maxWidth: '100%',
  display: "flex",
  justifyContent: "streatch",
};

export default function ProductCard({ product }) {

  return (

    <Link className="r-comp w-full sm:w-72" href={"/rent/products/" + product.slug}>

      <Card
        className="r-comp w-full flex justify-between flex-col"
        key={product.id}
        hoverable
        cover={<img alt="example"
          style={cardCover}
          src={(product.photos[0] ? product.photos[0].path : "/assets/img/no-image.jpeg")} />}
      >
        <Meta title={<div style={{ whiteSpace: 'pre-wrap' }}>{product.title}</div>} />
        <div style={{ width: '100%', margin: '10px 0px' }}></div>
        <Meta description={"Starting"} />
        <Meta title={<PriceTag price={product.rates[0].rate} currency={"INR"} />} />
        <div style={{ padding: 8, background: "#FCD03B", borderRadius: 8, color: "#555", textAlign:"center", marginTop:16, fontWeight:"bold"}}>
          Book Now
        </div>
      </Card>
    </Link>

  )
}
