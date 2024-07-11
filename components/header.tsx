"use client"

import { selectAuthState, authUser } from "../app-store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import { getAuthUser } from "../api/auth.api";
import { useEffect } from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";

import MainHeaderNav from "./MainHeaderNav";
import HeaderSubNav from "./HeaderSubNav";

export default function AppHeader({ navState, onNavStateChange }: { navState, onNavStateChange: () => void; }) {

  const loggedUser = useSelector(selectAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loggedUser) {
      getAuthUser().then((user) => dispatch(authUser(user)));
    }
  }, [loggedUser]);

  return (
    <div>
      <MainHeaderNav navState={navState} onNavStateChange={onNavStateChange} />
      <HeaderSubNav />
    </div>

  );
}
