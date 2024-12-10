import React from "react";
import { Tag, Button } from "antd";
import { IOrder } from "../../../app-store/types";
import { PageHeader } from "@ant-design/pro-layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "styles/orders.module.css";
import Moment from "moment";

interface AdminOrderHeaderProps {
  order: IOrder
}
export const AdminOrderHeader = ({ order }: AdminOrderHeaderProps) => {
  const router = useRouter();

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

  return (<PageHeader
    className={styles.orderHeader}
    key={order.id}
    ghost={false}
    tags={[
      <Tag key="1" color="red">
        {"₹" + order.amount}
      </Tag>,
      <Tag key="2" color="purple">
        <Link href={`/portal/admin/customers/${order.user.id}`}>
          {order.user.firstname}
        </Link>
      </Tag>,
      <Tag key="3" color="green">
        <Link
          href={`/uploads/${order.user.id}/invoices/invoice-${order.user.id}-${order.invoice.id}.pdf`}
          target="_blank">
          Invoice
        </Link>
      </Tag>,
    ]}
    title={"#" + order.id}
    subTitle={orderDuration(
      order.start_date,
      order.end_date
    )}
    extra={[
      <Button
        key="1"
        type="primary"
        onClick={() => {
          router.push("/portal/admin/orders/" + order.id);
        }}
      >
        Stage
      </Button>,
    ]}
  >

  </PageHeader>)

}
