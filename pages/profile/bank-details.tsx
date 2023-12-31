import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import AppNav from "../../components/AppNav";
import { AppFooter } from "../../components/footer";
import AppHeader from "../../components/header";

import { useDispatch, useSelector } from "react-redux";
import Moment from "moment";
import React from "react";
import { AppLayout } from "../../components/AppLayout";

export default function BankDetails() {
  const df = Moment().format("DD MMM");

  return (
    <AppLayout>
      <Content>Bank Details</Content>
    </AppLayout>
  );
}
