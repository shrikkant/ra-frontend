import { useRouter } from "next/router";

import { selectAuthState, authUser } from "../app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import { getAuthUser } from "../api/auth.api";
import { fetchProductCategories, fetchProducts } from "../api/products.api";
import {
  getCategories,
  setCategories,
} from "../app-store/app-defaults/app-defaults.slice";
import { useEffect, useState } from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";

import SearchBar from "./SearchBar";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CogIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaSearch } from "react-icons/fa";
import { SearchInput } from "./SearchInput";

export default function AppHeader({ navState, onNavStateChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [q, setQuery] = useState(router.query?.q);

  const searchProducts = () => {
    // const query = router.query;
    // delete query.q;
    // delete query.page;
    // delete query.br;
    // delete query.scid;
    // delete query.rf;

    // query.q = q;

    router.push("/rent?q=" + q);
  };
  const onSearch = (value: string) => {
    setQuery(value);
  };

  const loggedUser = useSelector(selectAuthState);
  const categories = useSelector(getCategories);

  const dispatch = useDispatch();

  const items = [
    // remember to pass the key prop
    { label: "My Cart", key: "my-products" },
    { label: "List for Rent", key: "list-gear" },
    { label: loggedUser ? loggedUser.email_address : "Login", key: "signin" },
  ];

  useEffect(() => {
    if (!categories || categories.length <= 0) {
      fetchProductCategories().then((data) => dispatch(setCategories(data)));
    }

    if (!loggedUser) {
      getAuthUser().then((user) => dispatch(authUser(user)));
    }
  }, [loggedUser, categories, dispatch]);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row h-28 sm:h-16 items-center justify-around border-gray-400">
          <div className="justify-between w-full inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className=" inset-y-0 left-0 flex items-center gap-x-6 ">
              <Disclosure.Button
                onClick={onNavStateChange}
                className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
            <Menu as="div" className="relative ml-3">
              <div>
                {loggedUser ? (
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={loggedUser.profile_pic}
                      alt=""
                    />
                  </Menu.Button>
                ) : (
                  <button
                    type="button"
                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">Sign In</span>
                    <UserPlusIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
              </div>
            </Menu>
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
