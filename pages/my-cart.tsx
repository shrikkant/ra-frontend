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
import { OrderItemsReview } from "../components/order/OrderItemsReview";
import { ORDER_STEPS } from "../config/constants";
import { AddressPicker } from "../components/order/AddressPicker";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Orders() {
  const cart = useSelector(getCart);
  const loggedUser = useSelector(selectAuthState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressId, setAddressId] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const df = Moment().format("DD MMM");

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
    console.log("Cart Changed : ", cart);
    if (!cart) {
      fetchCart().then((data) => {
        dispatch(setCart(data));
      });
    }
    setSelectedAddress(JSON.parse(cart?.delivery_address || null));
  }, [cart]);
  const backToHome = () => {
    const query: any = {};
    router.push({
      pathname: "/",
      query,
    });
  };

  const renderEmptyCartComponent = (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-3">
        <img
          src="/public/assets/img/empty-cart.png"
          className="w-[25%] h-[35%] mb-3"
          alt="Empty cart"
        />
        <span className="text-indigo-900 lg:text-3xl text-md font-bold">
          Looks Like Your Cart is Empty
        </span>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={backToHome}
            className="button rounded-md bg-gray-500 text-white py-2 px-3 flex items-center focus:outline-none focus:ring focus:ring-gray-300 hover:bg-gray-700"
          >
            Start Renting
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <Content className={styles.mainContent}>
        {cart ? (
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
        ) : (
          renderEmptyCartComponent
        )}
      </Content>
    </AppLayout>
  );
}
