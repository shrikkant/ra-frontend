/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter, useSearchParams } from "next/navigation";

import { selectAuthState } from "app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React, { useEffect, useState } from "react";


import { Disclosure } from "@headlessui/react";
import {
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import TopNavMenu from "components/TopNavMenu";

import { getDefaultSearch } from "app-store/session/session.slice";
import { fetchCart } from "api/user/orders.api";
import { IDefaultSearch, ISearchLocation } from "app-store/app-defaults/types";
import { getCart, setCart } from "app-store/user/orders/orders.slice";
import { IOrder } from "app-store/types";
import SearchBar from "../../../../components/SearchBar";
import { SearchInput } from "../../../../components/SearchInput";
import { FaHome } from "react-icons/fa";





export default function MainHeaderNav() {
  const loggedUser = useSelector(selectAuthState);
  const dispatch = useDispatch()
  const defaultSearch: any = useSelector<IDefaultSearch>(getDefaultSearch);

  const [location, setLocation] = useState<ISearchLocation>();

  const storeSearch = useSelector(getDefaultSearch);
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get("q");
  const [searchText, setSearchText] = useState(q);
  const cart = useSelector(getCart);
  const searchProducts = () => {
    console.log("Store Search ", storeSearch);
    const city = location?.city?.toLowerCase() || "pune";
    router.push("/" + city + "?q=" + searchText);
  };

  const onSearch = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {

    if (loggedUser && !cart) {
      fetchCart().then((o: IOrder) => {
        dispatch(setCart(o));
      });
    }
    setLocation(storeSearch ? storeSearch.location : defaultSearch?.location);
  }, [cart, storeSearch]);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="px-2 md:px-4 container m-auto">
        <div className="relative flex flex-col sm:flex-row h-28 sm:h-16 items-center justify-around border-gray-400">
          <div className="justify-between w-full inset-y-0 right-0 flex items-center sm:static sm:inset-auto">
            <div className=" inset-y-0 left-0 flex items-center sm:gap-x-6 ">
              <div className="my-4 justify-center ">
                <a href="/">
                  <img className="hidden lg:block h-6" src="/assets/v2/img/logo.png" alt="RentAcross" />
                  <FaHome className="block lg:hidden h-6 w-6 text-amber-500" />
                </a>
              </div>

              <SearchBar></SearchBar>
              <div className="hidden sm:block">
                <SearchInput
                  currentVal={q}
                  onSearch={searchProducts}
                  onChange={onSearch}
                ></SearchInput>
              </div>
            </div>
            <div className="flex items-center gap-x-5">
              {loggedUser && (
                <a
                  className="relative bg-gray-800  hover:bg-gray-800 hover:text-slate-50 p-2 rounded-md tex-sm font-semibold text-gray-400 content-center"
                  href="/p/mycart"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {(cart && cart.items) && cart.items.length > 0 && (
                    <span className="absolute text-white right-0 top-0 rounded-full bg-red-600 w-4 h-4 font-sans text-xs top right p-0 m-0 flex justify-center items-center">
                      {cart.items?.length}
                    </span>
                  )}
                </a>
              )}

              <TopNavMenu />
            </div>
          </div>

          <div className="flex justify-center gap-x-5 w-full sm:hidden">
            <SearchInput
              currentVal={q}
              onSearch={searchProducts}
              onChange={onSearch}
            ></SearchInput>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
