"use client";
import { useRouter } from "next/router";
import ActivityCard from "components/ActivityCard";
import DocumentsCard from "components/DocumentsCard";

import { useDispatch, useSelector } from "react-redux";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";
import {
  getActiveCustomer,
  setActiveCustomer,
} from "app-store/admin/index.slice";

import { fetchActiveCustomer } from "api/admin/customers.api";
import CustomerCard from "components/CustomerCard";
import { AppLayout } from "components/AppLayout";

export default function Customers() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);

  const customerId = parseInt(String(id));
  const activeCustomer = useSelector(getActiveCustomer);
  const dispatch = useDispatch();

  const loadActiveCustomer = () => {
    setLoading(true);
    fetchActiveCustomer(customerId).then((customer) => {
      setLoading(false);
      dispatch(setActiveCustomer(customer));
    });
  };

  useEffect(() => {
    router.isReady && loadActiveCustomer();
  }, [router.isReady]);

  return (
    <AppLayout>
      <MyPageHeader title={"Customers"} subtitle={""}></MyPageHeader>

      {activeCustomer && (
        <div>
          <div className="flex xs:flex-col p-4 xs:gap-y-4">
            <div style={{ flex: 1 }}>
              <CustomerCard customer={activeCustomer} ></CustomerCard>
            </div>
          </div>
          <div className="p-4">
            <div style={{ flex: 1 }}>
              <DocumentsCard customer={activeCustomer}></DocumentsCard>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
