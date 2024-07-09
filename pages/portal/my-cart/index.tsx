import { Content } from "antd/lib/layout/layout";
import {
  getCart,
  setCart,

} from "app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "api/user/orders.api";
import React, { useEffect, useState } from "react";
import OrderSummary from "components/OrderSummary";
import styles from "styles/my-cart.module.css";
import { AppLayout } from "components/AppLayout";
import { ORDER_STEPS } from "config/constants";

import EmptyCart from "components/cart/EmptyCart";
import Loader from "components/Loader";
import { IOrderItem } from "../../../app-store/types";
import OrderItemRow from "../../../components/OrderItemRow";
import { useRouter } from "next/router";

export default function Orders() {
  const router = useRouter();
  const cart: any = useSelector(getCart);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const onRazorPayCheckout = (mode: number) => {
    router.push("/portal/my-cart/buy");
  };

  const onRemove = async (id: number) => {
    setLoading(true);
    await removeFromCart(id);
    const cart = await fetchCart();
    dispatch(setCart(cart));
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (!cart) {
      fetchCart().then((data) => {
        dispatch(setCart(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AppLayout>
      <Content className={styles.mainContent}>
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
                    <div className={"border rounded-md border-gray-400"}>
                      {cart.items &&
                        cart.items.map((item: IOrderItem) => (
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
                      step={ORDER_STEPS.ORDER_STEP_CART
                      }
                      onInitRazorPay={onRazorPayCheckout}
                    ></OrderSummary>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyCart />
            )}
          </>
        )}
      </Content>
    </AppLayout>
  );
}
