"use client"
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "./search/DateRangePicker";
import { addToCart, fetchCart } from "../api/user/orders.api";
import { usePathname, useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { getDefaultSearch, setLastLink } from "app-store/session/session.slice";
import { IoIosClose } from "react-icons/io";
import PriceTag from "./PriceTag";
import { selectAuthState } from "../app-store/auth/auth.slice";
import { setCart } from "../app-store/user/orders/orders.slice";
import { BookingLineItem } from "./cart/BookingLineItem";
import SignIn from "./user/SignIn";
import Button from "./common/form/Button";
import { DISCOUNT_STEPS } from "../config/constants";

export default function BookingForm({ productId, discount, rates }: { productId: number, discount: number, rates: any[] }) {
  const dispatch = useDispatch();
  const [finalDiscount, setFinalDiscount] = useState(0);

  const loggedUser = useSelector(selectAuthState);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const originalRate = rates[0].rate;

  const discountedRate = Math.ceil(rates[0].rate - (rates[0].rate * finalDiscount / 100));


  const router = useRouter();
  const pathname = usePathname();


  const storeSearch = useSelector(getDefaultSearch);

  const [openFormInMobile, setOpenFormInMobile] = useState(false);

  const getDays = () => {
    const startDate =
      storeSearch && storeSearch.dates
        ? new Date(storeSearch?.dates.startDate)
        : new Date();
    const endDate =
      storeSearch && storeSearch.dates
        ? new Date(storeSearch.dates.endDate)
        : new Date();
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );
    return differenceInDays;
  };

  const getPlural = (text: string, days: number) => {
    return text + (days > 1 ? "s" : "");
  };

  const onAddToCart = async (bookNow?: boolean) => {
    if (!loggedUser && (pathname && pathname?.length > 0)) {
      dispatch(setLastLink(pathname))
      setShowSignIn(true);
    } else {
      if (!storeSearch?.dates)
        return;

      await addToCart(productId, storeSearch?.dates);
      const cart = await fetchCart();
      dispatch(setCart(cart));

      if (bookNow) {
        router.push("/p/mycart");
      } else {
        setOpenFormInMobile(false);
      }

    }
  };

  const onBookNow = () => {
    onAddToCart(true);
  }
  const getSavings = () => {
    return (originalRate - discountedRate) * getDays();
  }

  const closeSignInModal = () => {
    setShowSignIn(false);
  }

  const handleMobileBook = () => {
    if (!loggedUser?.id) {
      setShowSignIn(true);
    } else {
      setOpenFormInMobile(true);
    }

  };

  useEffect(() => {
    const days = getDays();
    const discountStep = DISCOUNT_STEPS.find(
      (step) => step.days <= days
    );
    console.log("Days ", days, discountStep);
    if (discountStep) {
      setFinalDiscount(discount + discountStep.discount);
    }


  }, [getDays()]);

  const renderForm = (
    <>
      <div>
        <div className="relative flex">

          <span className="flex">
            <span className="text-3xl pl-3 font-semibold">
              <PriceTag price={originalRate} discount={finalDiscount} />
            </span>
            <div className="ml-2 relative">
              <span className="absolute truncate text-sm bottom-0">
                per day
              </span>
            </div>
          </span>
        </div>
        <div className="flex flex-wrap flex-row rounded-md border border-gray-300 p-2 gap-20 justify-center mt-3">
          <div className="w-full flex justify-between items-center">
            <span className="label text-black font-semibold ml-2">
              Booking Dates
            </span>
            <span className="relative">
              <DateRangePicker mode={"dark"}></DateRangePicker>
            </span>
          </div>
        </div>
      </div>
      <div>

        <Button variant="primary" onClick={onBookNow} label="Book Now" />

      </div>

      <BookingLineItem amount={discountedRate * getDays()}>
        <span className="text-md font-semibold flex">
          <PriceTag price={discountedRate} />
        </span>
        <span>
          <span className="text-md text-gray-500 ">X {getDays() + " " + getPlural("day", getDays())}</span>
        </span>
      </BookingLineItem>



      {finalDiscount > 0 && <BookingLineItem amount={getSavings()}>
        <span className="text-md font-semibold flex">
          You Save
        </span>
      </BookingLineItem>}

      <BookingLineItem amount={discountedRate * getDays()} primary={true}>
        <span className="text-md font-semibold flex">
          Total
        </span>
      </BookingLineItem>

    </>
  );

  return (
    <div className="">
      <div className="md:block hidden bg-white shadow-md  p-5 text-sm h-full w-full  border border-1 border-gray-200 ">
        <div className="flex md:flex-col gap-4">
          {renderForm}
        </div>
      </div>


      {!openFormInMobile ? (
        <div className={`fixed p-4 bottom-0 left-0 right-0 bg-white md:hidden py-3 text-center border-t border-gray-300 cursor-pointer flex justify-between z-40 ${showSignIn ? "hidden" : ""}`}>
          <div className="relative flex items-center">
            <span className="absolute text-md top-2">

            </span>
            <span className="text-3xl pl-3 ">
              <PriceTag price={originalRate} discount={finalDiscount} />
            </span>
          </div>
          <button
            className="p-1 btn  px-10 py-2 rounded-md"
            onClick={() => {
              handleMobileBook();
            }}
          >
            <span>Book Now</span>
          </button>
        </div>
      ) : (
        <div className="fixed top-0 left-0 h-screen w-full bg-white md:hidden z-[500]">
          <div className=" flex flex-col gap-4 p-5 mt-4">
            {renderForm}
            <span
              className="absolute button text-black text-3xl text-semibold top-2 right-3"
              onClick={() => {
                setOpenFormInMobile(false);
              }}
            >
              <IoIosClose />
            </span>
          </div>
        </div>
      )}

      {showSignIn && <SignIn onClose={closeSignInModal}></SignIn>}
    </div>
  );
}


