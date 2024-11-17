import React from "react";
import styles from "./../styles/order-summary.module.css";
import { ORDER_STEPS } from "../config/constants";
import { dateDisplay } from "../util/date.util";
import { IOrder } from "../app-store/types";
import Button from "./common/form/Button";

export default function OrderSummary({
  order,
  step,
  onCallToAction }:
  {
    order: IOrder,
    step: number,
    showCallToAction?: boolean,
    onCallToAction: (mode: number) => void
  }) {

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
    <div className={"p-3 bg-gray-50 shadow-lg rounded-md min-w-[276px]"}>
      <div>
        <div className="fixed md:relative bottom-0 left-0 p-4 md:p-0 bg-slate-50 w-full shadow-2xl md:shadow-none">
          {callToAction(step) &&
            <Button variant="primary" onClick={() => onCallToAction(step)} label={callToAction(step)} />
          }
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
          <div>₹{parseInt(order.total_amount + (order.applied_discount ? order.applied_discount : 0) + "")}</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Taxes</div>
          <div>₹{order.gst_tax}</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Delivery &amp; Pickup Fee</div>
          <div>₹{order.delivery_fee}</div>
        </div>

        {(order.applied_discount && order.applied_discount > 0) && <div className={styles["detail-row"] + " text-red-600"}>
          <div>You Save</div>
          <div className="font-semibold">₹{order.applied_discount}</div>
        </div>}

        <div
          className={
            "flex text-rose-600 font-bold justify-between text-xl border-t border-gray-300 pt-3"
          }
        >
          <div>Order Total</div>
          <div>
            <span>₹</span>
            <span>{order.total_amount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
