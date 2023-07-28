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

import styles from "styles/header.module.css";
import React from "react";

import SearchBar from "./SearchBar";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CogIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Orders", href: "/admin/orders?stage=1", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

export default function AppHeader({ navState, onNavStateChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const onClick = (e) => {
    router.push("/" + e.target.value);
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
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
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center">
            {/* Mobile menu button*/}

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
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="/assets/img/logo.png"
                    alt="RentAcross"
                  />
                </div> */}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                {loggedUser && (
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={loggedUser.profile_pic}
                      alt=""
                    />
                  </Menu.Button>
                )}
              </div>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <div style={{ flex: 1 }}>
          <a href="/">
            <img
              src="https://www.rentacross.com/assets/img/logo.png?version=12"
              style={{ maxHeight: "32px" }}
            ></img>
          </a>
        </div>

        <div style={{ alignItems: "center", display: "flex" }}>
          <SearchBar></SearchBar>
        </div>

        <div style={{ flex: 1 }}>
          <select onChange={onClick}>
            {items &&
              items.map((loc) => (
                <option key={loc.key} value={loc.key}>
                  {loc.label}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
