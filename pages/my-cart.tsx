import { Content } from "antd/lib/layout/layout";

import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from "../app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../api/user/orders.api";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import OrderSummary from "../components/OrderSummary";
import styles from "../styles/my-cart.module.css";
import { AppLayout } from "../components/AppLayout";
import { displayRazorpay } from "../util/razorpay.util";
import { selectAuthState } from "../app-store/auth/auth.slice";
import { AddressList } from "../components/AddressList";
import { Address } from "../components/Address";
import { OrderItemsReview } from "../components/order/OrderItemsReview";
import { ORDER_STEPS } from "../config/constants";
import { StepHeader } from "../components/order/StepHeader";
import { AddressPicker } from "../components/order/AddressPicker";

export default function Orders() {
  const cart = useSelector(getCart);
  const loggedUser = useSelector(selectAuthState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressId, setAddressId] = useState(null);

  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  if (!cart) {
    fetchCart().then((data) => {
      dispatch(setCart(data));
    });
  }

  const onRazorPayCheckout = (mode) => {
    const currentAddr = loggedUser.address.find(
      (ad) => ad.id === addressId
    ) || { id: -1, name: "Store Pickup" };

    if (mode === ORDER_STEPS.ORDER_STEP_DELIVERY) {
      updateDeliveryAddressAction(cart, currentAddr)(dispatch);
      setSelectedAddress(currentAddr);
    } else if (mode === ORDER_STEPS.ORDER_STEP_PAYMENT) {
      displayRazorpay(cart.id);
    }
  };

  const changeAddress = () => {
    setSelectedAddress(null);
  };

  const checkRadio = (addressId: number) => {
    setAddressId(addressId);
  };

  useEffect(() => {
    setSelectedAddress(JSON.parse(cart?.delivery_address || null));
  }, [cart]);

  return (
    <AppLayout>
      <Content className={styles.mainContent}>
        {cart && (
          <div className={"flex flex-col-reverse md:flex-row w-full space-x-8"}>
            <div className={"md:w-3/4 w-full"}>
              <AddressPicker
                onAddressPick={checkRadio}
                onAddressReset={changeAddress}
                selectedAddress={selectedAddress}
              ></AddressPicker>

              <OrderItemsReview
                order={cart}
                selectedAddress={selectedAddress}
              ></OrderItemsReview>
            </div>

            <div className={"w-1/4"}>
              <div className="md:fixed top-100 w-80">
                <OrderSummary
                  order={cart}
                  step={
                    selectedAddress
                      ? ORDER_STEPS.ORDER_STEP_PAYMENT
                      : ORDER_STEPS.ORDER_STEP_DELIVERY
                  }
                  onInitRazorPay={onRazorPayCheckout}
                ></OrderSummary>
              </div>
            </div>
          </div>
        )}
      </Content>
    </AppLayout>
  );
}
