import React from "react";
import styles from "./../styles/order-summary.module.css";
import { ORDER_STEPS } from "../config/constants";
import { dateDisplay } from "../util/date.util";
import { IOrder } from "../app-store/types";
import Button from "./common/form/Button";
import Decimal from "decimal.js";

export default function OrderSummary({
  order,
  step,
  isLoading,
  onCallToAction
}:
  {
    order: IOrder,
    step: number,
    showCallToAction?: boolean,
    isLoading?: boolean,
    onCallToAction: (mode: number) => void
  }) {
  const discount = new Decimal(order.applied_discount ? order.applied_discount : 0);
  const totalRent = new Decimal(order.amount).add(discount);
  const deliveryFee = new Decimal(order.delivery_fee);
  const totalAmount = totalRent.add(deliveryFee).sub(discount);
  const callToAction = (step: number) => {
    switch (step) {
      case ORDER_STEPS.ORDER_STEP_CART:
        return "Proceed to Book";
      case ORDER_STEPS.ORDER_STEP_DELIVERY:
        return "Review & Pay";
      case ORDER_STEPS.ORDER_STEP_PAYMENT:
        return "Place Your Order";
      case ORDER_STEPS.ORDER_PAID:
        return "Order Placed"
    }
  }

  return (
    <div className={"p-4 bg-gray- border border-amber-400 shadow-lg rounded-md min-w-[276px]"}>
      <div>
        <div className="text-center text-2xl font-bold border-b border-gray-200 pb-2">
          Order Summary
        </div>
      </div>
      <div className={"flex border-gray-200 border justify-around rounded-md mt-5"}>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Starting</span>
          <span className={"text-md font-semibold"}>{dateDisplay(order.start_date)}</span>
        </div>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Ending</span>
          <span className={"text-md font-semibold"}>{dateDisplay(order.end_date)}</span>
        </div>
      </div>

      <div
        className={"flex flex-col pt-3 gap-y-3 border-t border-gray-300 mt-5"}
      >
        <div className={"text-xl font-bold xs:hidden"}>Order Summary</div>
        <div className={styles["detail-row"]}>
          <div>
            Rent for <span>{order.days}</span> days
          </div>
          <div>₹{totalRent.toFixed(2)}</div>
        </div>


        <div className={styles["detail-row"]}>
          <div>Delivery &amp; Pickup Fee</div>
          <div>₹{new Decimal(order.delivery_fee).toFixed(2)}</div>
        </div>

        {(order.applied_discount && order.applied_discount > 0) && <div className={styles["detail-row"] + " text-red-600"}>
          <div>You Save</div>
          <div className="font-semibold">₹{new Decimal(order.applied_discount).toFixed(2)}</div>
        </div>}

        <div
          className={
            "flex text-rose-600 font-bold justify-between text-xl border-t border-gray-300 pt-3"
          }
        >
          <div>Order Total</div>
          <div>
            <span>₹</span>
            <span>{totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>
      <div>
        <div className="fixed md:relative bottom-0 left-0 p-4 md:p-0 bg-slate-50 w-full shadow-2xl md:shadow-none mt-4">
          {callToAction(step) &&
            <Button
              isLoading={isLoading}
              variant="primary"
              onClick={() => onCallToAction(step)}
              label={callToAction(step)} />
          }
        </div>
      </div>
    </div>
  );
}
