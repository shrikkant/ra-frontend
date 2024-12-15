/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CustomerDetails from "../../../../components/admin/CustomerDetails.client";

interface Props {
  params: any;
}

export default async function Page({ params }: Props) {
  const localParams = await params;

  return (
    <CustomerDetails id={localParams.id} />
  );
}
