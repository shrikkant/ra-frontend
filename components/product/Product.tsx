import { Content } from "antd/lib/layout/layout";
import { HeadCard } from "./HeadCard";
import { Package } from "./Package";
import { Description } from "./Description";
import BookingForm from "../BookingForm";

export const Product = ({product}) => {

  return (
    <Content style={{ maxWidth: 1240, margin: "auto" }}>
      <div className={"flex flex-col sm:flex-row"}>
        <div className="sm:w-3/4 w-full">
          <HeadCard product={product}></HeadCard>
          <Package addons={product.masterProductList}></Package>
          <Description
            description={product?.masterProduct?.description}
          ></Description>
        </div>

        <div className={"sm:w-1/4 w-full"}>
          <div className="fixed top-100 w-80">
            <BookingForm rates={product?.rates} productId={product.id}></BookingForm>
          </div>
        </div>
      </div>
    </Content>
  );
};
