import React from "react";
import MyPageHeader from "../../../components/MyPageHeader";
import { UserOrders } from "../../components/user/orders/UserOrders";

export default async function Page() {



  return (
    <>
      <React.StrictMode>
        <MyPageHeader title={"My Orders"} subtitle={""}></MyPageHeader>
        <UserOrders />


      </React.StrictMode>
    </>
  );
}
