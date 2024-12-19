"use client"

import DocumentsCard from "components/DocumentsCard";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchActiveCustomer } from "api/admin/customers.api";
import CustomerCard from "components/CustomerCard";

import { IUser } from "../../../app-store/types";

interface CustomerDetailsProps {
  id: string;
}

export default function CustomerDetails({ id }: CustomerDetailsProps) {
  const [activeCustomer, setActiveCustomer] = useState<IUser>();

  const loadActiveCustomer = (customerId: number) => {
    fetchActiveCustomer(customerId).then((customer: IUser) => {
      setActiveCustomer(customer);
    });
  };

  useEffect(() => {
    if (id) {
      const customerId = parseInt(String(id));
      loadActiveCustomer(customerId);
    }
  }, [id]);


  return (
    <>
      <MyPageHeader title={"Customers"}></MyPageHeader>

      {activeCustomer?.id && (
        <div>
          <div>
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
    </>
  );
}
