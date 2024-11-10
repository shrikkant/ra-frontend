import React from "react";

interface ProductProps {
  description: string;
}

export const Description: React.FC<ProductProps> = ({ description }: ProductProps) => {
  const markup = { __html: description ? description : "" };
  return (
    <div>
      <h2 className="text-xl py-4 capitalize font-semibold">Highlights & Specifications</h2>
      <div dangerouslySetInnerHTML={markup} />
    </div>
  );
};
