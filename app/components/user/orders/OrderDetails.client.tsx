"use client"
import { fetchOrder, removeFromCart } from "api/user/orders.api";
import React, { useEffect, useState } from "react";
import OrderSummary from "components/OrderSummary";
import { ORDER_STEPS } from "config/constants";

import EmptyCart from "components/cart/EmptyCart";
import Loader from "components/Loader";
import { IOrder, IOrderItem } from "app-store/types";
import OrderItemRow from "components/OrderItemRow";

import DocumentUpload from "components/common/DocumentUpload";

interface OrderDetailsProps {
  id: number;
}

export default function OrderDetails({ id }: OrderDetailsProps) {

  const [cart, setCart] = useState<IOrder>();
  const [loading, setLoading] = useState(true);


  const onRazorPayCheckout = () => {
    console.log("RazorPay Checkout");
  };

  const onRemove = async (id: number) => {
    setLoading(true);
    await removeFromCart(id);

    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (id) {
      const orderId = parseInt(String(id));
      fetchOrder(orderId).then((data) => {
        setCart(data);
        setLoading(false);
      });
    }

  }, []);

  return (
    <>
      <div>
        {loading ? (
          <Loader />
        ) : (
          <>

            {cart ? (
              <div
                className={"flex flex-col-reverse md:flex-row w-full md:space-x-8"}
              >

                <div className={"md:w-3/4 w-full"}>
                  <div className="p-4">
                    <div className={"border rounded-md border-gray-400 p-3"}>
                      <DocumentUpload />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className={"border rounded-md border-gray-400"}>
                      {cart?.items &&
                        cart?.items.map((item: IOrderItem) => (
                          <OrderItemRow
                            key={item.id}
                            onRemove={onRemove}
                            orderItem={item} />
                        ))}
                    </div>
                  </div>
                </div>

                <div className={"md:w-1/4 w-full"}>
                  <div className="md:fixed top-100 md:w-80 w-full p-4">
                    <OrderSummary
                      order={cart}
                      step={ORDER_STEPS.ORDER_PAID
                      }
                      onCallToAction={onRazorPayCheckout}
                    ></OrderSummary>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyCart />
            )}
          </>
        )}
      </div>
    </>
  );
}
