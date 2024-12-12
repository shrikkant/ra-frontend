import React from "react";
import { Button } from "antd";
import { IOrder } from "../../../app-store/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Moment from "moment";
import { Section } from "../../../app/components/common/Section";

interface AdminOrderHeaderProps {
  order: IOrder,
  children?: React.ReactNode
}
export const AdminOrderHeader = ({ order, children }: AdminOrderHeaderProps) => {
  const router = useRouter();

  const tags = [
    <div key="1" color="red">
      {"₹" + order.amount}
    </div>,
    <div key="2" color="purple">
      <Link href={`/p/admin/customers/${order.user.id}`}>
        {order.user.firstname}
      </Link>
    </div>,
  ];

  const orderDuration = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) {
      return "";
    }

    return (
      Moment(start).utcOffset(0).format("DD MMM") +
      " - " +
      Moment(end).utcOffset(0).format("DD MMM")
    );
  };

  tags.push(<div key={"1"}>
    {orderDuration(order.start_date, order.end_date)}
  </div>)

  if (order.invoice) {
    tags.push(
      <div key="3" color="green">
        <Link
          href={`/uploads/${order.user.id}/invoices/invoice-${order.user.id}-${order.invoice.id}.pdf`}
          target="_blank">
          Invoice
        </Link>
      </div>
    );
  }



  return (<Section title={"#" + order.id}
    tags={tags}
    actions={[
      <Button
        key="1"
        type="primary"
        onClick={() => {
          router.push("/p/admin/orders/" + order.id);
        }}
      >
        Stage
      </Button>,
    ]}>
    {children}
  </Section>);
}
