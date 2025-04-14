import React from "react";
// import { Button } from "antd";
import { IOrder } from "../../../app-store/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Section } from "../../../app/components/common/Section";
import { FaShippingFast } from "react-icons/fa";

interface AdminOrderHeaderProps {
  order: IOrder,
  children?: React.ReactNode
}
export const AdminOrderHeader = ({ order, children }: AdminOrderHeaderProps) => {
  const router = useRouter();

  const tags = [

    <div key="2" color="purple">
      <Link href={`/p/admin/customers/${order.user.id}`}>
        {order.user.firstname}
      </Link>
    </div>,
  ];

  if (order.invoice) {
    tags.push(
      <div key="3" color="green">
        <Link
          className="p-0"
          href={`/api/admin/orders/${order.id}/invoice`}
          target="_blank">
          Invoice
        </Link>
      </div>
    );

    if (order.delivery_fee_paid > 0) {
      tags.push(
        <div key="4" >
          <FaShippingFast />
        </div>
      );
    }
  }



  return (<Section title={"#" + order.id}
    tags={tags}
    actions={[
      <button
        className="p-0"
        key="1"
        onClick={() => {
          router.push("/p/admin/orders/" + order.id);
        }}
      >
        Stage
      </button>,
    ]}>
    {children}
  </Section>);
}
