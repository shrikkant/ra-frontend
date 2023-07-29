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
import MainHeaderNav from "./MainHeaderNav";

export default function AppHeader({ navState, onNavStateChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [q, setQuery] = useState(router.query?.q);

  const searchProducts = () => {
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
    <div>
      <MainHeaderNav navState={navState} onNavStateChange={onNavStateChange}/>

    </div>

  );
}
