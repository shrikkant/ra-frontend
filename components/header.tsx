import { useRouter } from "next/router";

import { selectAuthState, authUser } from "../app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import { getAuthUser } from "../api/auth.api";
import { useEffect, useState } from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";

import MainHeaderNav from "./MainHeaderNav";
import HeaderSubNav from "./HeaderSubNav";

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

  const [categoryNav, setCategoryNav] = useState(false);

  const toggleCategoryNav = () => {
    setCategoryNav(!categoryNav);
  };

  const dispatch = useDispatch();

  const items = [
    // remember to pass the key prop
    { label: "My Cart", key: "my-products" },
    { label: "List for Rent", key: "list-gear" },
    { label: loggedUser ? loggedUser.email_address : "Login", key: "signin" },
  ];

  useEffect(() => {
    if (!loggedUser) {
      getAuthUser().then((user) => dispatch(authUser(user)));
    }
  }, [router.isReady]);

  return (
    <div>
      <MainHeaderNav navState={navState} onNavStateChange={onNavStateChange}/>
      <HeaderSubNav categoryNav={categoryNav} toggleCategoryNav={toggleCategoryNav}/>
    </div>

  );
}
