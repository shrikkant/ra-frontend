import React from "react";
import { IOrder, IOrderItem } from "../../app-store/types";
import OrderItemRow from "../OrderItemRow";

import { StepHeader } from "./StepHeader";

export const OrderItemsReview = ({
  order,
  title,
}: {
  order: IOrder,
  title: string
}) => {
  return (
    <div >
      <StepHeader label={title} ></StepHeader>

      <div className={"border rounded-md border-gray-400 mt-4"}>
        {order.items &&
          order.items.map((item: IOrderItem) => (
            <OrderItemRow key={item.id} orderItem={item}></OrderItemRow>
          ))}
      </div>
    </div>
  );
};
