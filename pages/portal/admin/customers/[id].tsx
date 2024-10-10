"use client";
import { useRouter } from "next/router";
import DocumentsCard from "components/DocumentsCard";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchActiveCustomer } from "api/admin/customers.api";
import CustomerCard from "components/CustomerCard";
import { AppLayout } from "components/AppLayout";
import { IUser } from "../../../../app-store/types";

export default function Customers() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);

  const [activeCustomer, setActiveCustomer] = useState<IUser>();

  const loadActiveCustomer = (customerId: number) => {
    setLoading(true);
    fetchActiveCustomer(customerId).then((customer: IUser) => {
      setLoading(false);
      setActiveCustomer(customer);
    });
  };

  useEffect(() => {
    if (id) {
      const customerId = parseInt(String(id));
      loadActiveCustomer(customerId);
    }
  }, [router.isReady, id]);

  return (
    <AppLayout>
      <MyPageHeader title={"Customers"} subtitle={""}></MyPageHeader>

      {activeCustomer?.id && (
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
