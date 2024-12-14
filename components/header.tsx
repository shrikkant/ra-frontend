
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import React from "react";

import { IProductCategory } from "../app-store/types";
import HeaderSubNav from "../app/components/common/layout/HeaderSubNav";

interface AppHeaderProps {
  categories: IProductCategory[];
}
export default function AppHeader({ categories }: AppHeaderProps) {

  return (
    <div>
      {/* <MainHeaderNav /> */}
      <HeaderSubNav categories={categories} />
    </div>

  );
}
