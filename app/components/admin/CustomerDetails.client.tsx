"use client"

import DocumentsCard from "components/DocumentsCard";
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchActiveCustomer } from "api/admin/customers.api";

import { IUser } from "../../../app-store/types";
import { ProfileCard } from "../user/ProfileCard.client";
import CustomerCard from "../../../components/CustomerCard";

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
              <ProfileCard user={activeCustomer} />
            </div>
            <div>
              <CustomerCard customer={activeCustomer} />
            </div>
          </div>

          <div>
            <div style={{ flex: 1 }}>
              <DocumentsCard user={activeCustomer}></DocumentsCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
