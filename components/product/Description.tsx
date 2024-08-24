import React from "react";
import { Card } from "antd";
import { de } from "date-fns/locale";

interface ProductProps {
  description: string;
}

export const Description: React.FC<ProductProps> = ({ description }: ProductProps) => {
  const markup = { __html: description ? description : "" };
  return (
    <Card
      title={"Product Specifications"}
      hoverable
      style={{ width: "100%", marginTop: "40px" }}
    >
      <div dangerouslySetInnerHTML={markup} />
    </Card>
  );
};
