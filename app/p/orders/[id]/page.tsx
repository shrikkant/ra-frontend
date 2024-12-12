import React from "react";

import OrderDetails from "../../../components/user/orders/OrderDetails.client";

interface PageParams {
  id: string;
}
interface Props {
  params: PageParams;
}

export default async function Page({ params }: Props) {
  const localParams = await params;

  return (
    <OrderDetails id={localParams.id} />
  );
}
