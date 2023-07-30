import { useRouter } from "next/router";

import { selectAuthState, authUser } from "../app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React, { useState } from "react";

import SearchBar from "./SearchBar";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SearchInput } from "./SearchInput";
import TopNavMenu from "components/TopNavMenu";

export default function MainHeaderNav({ navState, onNavStateChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [q, setQuery] = useState(router.query?.q);

  const searchProducts = () => {
    router.push("/rent?q=" + q);
  };
  const onSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row h-28 sm:h-16 items-center justify-around border-gray-400">
          <div className="justify-between w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 flex items-center gap-x-6 ">
              <Disclosure.Button
                onClick={onNavStateChange}
                className={
                  (navState ? "" : "sm:hidden") +
                  "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                }
              >
                <span className="sr-only">Open Menu</span>
                {navState ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
              <SearchBar></SearchBar>
              <div className="hidden sm:block">
                <SearchInput
                  currentVal={q}
                  onSearch={searchProducts}
                  onChange={onSearch}
                ></SearchInput>
              </div>
            </div>

            {/* Profile dropdown */}
            <TopNavMenu/>
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