
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";

import MainHeaderNav from "./MainHeaderNav";
import HeaderSubNav from "./HeaderSubNav";

export default function AppHeader() {

  return (
    <div>
      <MainHeaderNav />
      <HeaderSubNav />
    </div>

  );
}
