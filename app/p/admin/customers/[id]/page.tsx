import React from "react";
import CustomerDetails from "../../../../components/admin/CustomerDetails.client";

interface PageParams {
  id: string;
}
interface Props {
  params: PageParams;
}

export default async function Page({ params }: Props) {
  const localParams = await params;

  return (
    <CustomerDetails id={localParams.id} />
  );
}
