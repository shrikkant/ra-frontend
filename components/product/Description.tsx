import React from "react";

interface ProductProps {
  description: string;
  specifications: string;
}

export const Description: React.FC<ProductProps> = ({ description, specifications }: ProductProps) => {
  const markup = { __html: description ? description : "" };
  const specificationsMarkup = { __html: specifications ? specifications : "" };
  return (
    <div>
      <h2 className="text-xl py-4 capitalize font-semibold">Highlights & Specifications</h2>
      <div dangerouslySetInnerHTML={markup} />
      <div dangerouslySetInnerHTML={specificationsMarkup} />
    </div>
  );
};
