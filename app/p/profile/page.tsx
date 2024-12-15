
import React from "react";
import MyPageHeader from "components/MyPageHeader";
import { LoggedUserCard } from "../../components/user/LoggedUserCard";

export default function Page() {
  return (
    <>
      <MyPageHeader title={"My Profile"}></MyPageHeader>
      <LoggedUserCard />
    </>
  );
}
