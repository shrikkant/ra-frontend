import React from "react";
import { ILocation, IOrder, IOrderItem } from "../../app-store/types";
import OrderItemRow from "../OrderItemRow";

import { StepHeader } from "./StepHeader";

export const OrderItemsReview = ({
  order,
  selectedAddress,
  title
}: {
  order: IOrder,
  selectedAddress?: ILocation | null,
  title: string
}) => {
  return (
    <div className="p-4">
      <StepHeader label={title} ></StepHeader>

      <div className={"border rounded-md border-gray-400 md:ml-8 mt-3"}>
        {order.items &&
          order.items.map((item: IOrderItem) => (
            <OrderItemRow key={item.id} orderItem={item}></OrderItemRow>
          ))}
      </div>
    </div>
  );
};
