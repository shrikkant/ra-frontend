"use client"
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "./search/DateRangePicker";
import { addToCart } from "../api/user/orders.api";
import { usePathname, useRouter } from "next/navigation";
import { RupeeSymbol } from "./RupeeSymbol";
import { useDispatch, useSelector } from "react-redux";
import { getDefaultSearch, setLastLink, setSearch } from "app-store/session/session.slice";
import { IoIosClose } from "react-icons/io";
import PriceTag from "./PriceTag";
import { authUser, selectAuthState } from "../app-store/auth/auth.slice";
import { IDefaultSearch } from "../app-store/app-defaults/types";
import { getAuthUser } from "../api/auth.api";



export default function BookingForm({ productId, rates }: { productId: number, rates: any[] }) {
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectAuthState);

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

  const onAddToCart = (bookNow?: boolean) => {
    if (!loggedUser && pathname) {
      dispatch(setLastLink(pathname))
      router.push("/signin");
    } else {
      if (!storeSearch?.dates)
        return;
      addToCart(productId, storeSearch?.dates).then(() => {
        if (bookNow) {
          router.push("/portal/my-cart");
        }
      });
    }
  };

  useEffect(() => {
    if (!loggedUser) {
      getAuthUser().then((user) => {
        dispatch(authUser(user))
      });
    }

  }, [loggedUser]);

  const renderForm = (
    <>
      <div>
        <div className="relative flex">
          <span className="absolute text-sm font-semibold top-0 left-0">
            <RupeeSymbol />
          </span>
          <span className="flex">
            <span className="text-3xl pl-3 font-semibold">
              <PriceTag price={rates[0].rate} showCurrency={false} />
            </span>
            <div className="ml-2 relative">
              <span className="absolute truncate text-sm bottom-0">
                per day
              </span>
            </div>
          </span>
        </div>
        <div className="flex flex-wrap flex-row rounded-md border border-gray-300 p-2 gap-20 justify-center mt-3">
          <div className="w-full flex justify-between">
            <span className="label text-black font-semibold ml-2">
              Booking Dates
            </span>
            <span className="relative">
              <DateRangePicker mode={"dark"}></DateRangePicker>
            </span>
          </div>
        </div>
      </div>
      {loggedUser && (
        <div>
          <input
            onClick={() => onAddToCart()}
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="button"
            value="Add to Cart"
          />
        </div>
      )}
      <div>
        <input
          onClick={() => onAddToCart(true)}
          className="bg-[#ffa41c] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffa41c]"
          type="submit"
          value="Book Now"
        />
      </div>
      <div className="flex justify-between m-1">
        <div className="flex gap-1">
          <span className="text-md font-semibold flex gap-1">
            <RupeeSymbol />
            <PriceTag price={rates[0].rate} showCurrency={false} />
          </span>
          <span>
            <span className="text-md text-gray-500 ">X {getDays()} day</span>
          </span>
        </div>
        <div className="text-md font-semibold flex gap-1">
          <RupeeSymbol />
          <PriceTag price={rates[0].rate * getDays()} showCurrency={false} />
        </div>
      </div>
      <div>
        <div className="mb-1 mt-0 ms-0 w-full h-px flex-1 bg-gray-500"></div>
        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total before taxes</span>
          <div className="relative flex gap-1">
            <span className="text-sm font-semibold top-0 left-0">
              <RupeeSymbol />
            </span>
            <span className="text-2xl font-semibold">
              <PriceTag
                price={rates[0].rate * getDays()}
                showCurrency={false}
              />
            </span>
          </div>
        </div>
      </div>
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
        <div className="fixed p-4 bottom-0 left-0 right-0 bg-white md:hidden py-3 text-center border-t border-gray-300 cursor-pointer flex justify-between z-40">
          <div className="relative flex">
            <span className="absolute text-md font-semibold top-0">
              <RupeeSymbol />
            </span>
            <span className="text-3xl pl-3 font-semibold">
              <PriceTag price={rates[0].rate} showCurrency={false} />
            </span>
          </div>
          <button
            className="bg-amber-500 text-black px-10 py-2 rounded-2xl font-semibold"
            onClick={() => {
              setOpenFormInMobile(true);
            }}
          >
            Book
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
    </div>
  );
}


