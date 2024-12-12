import React from "react";
import OrderDetails from "../../../../components/admin/OrderDetails.client";
interface PageParams {
  id: string;
}
interface Props {
  params: PageParams;
}

export default async function Page({ params }: Props) {
  const localParams = await params;
  const orderId = parseInt(localParams.id);

  return (
    <OrderDetails id={orderId} />
  );
}
