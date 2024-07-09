
import Table from "antd/lib/table/Table";
import { Content } from "antd/lib/layout/layout";

import {
  getBrands,
  setBrands,
} from "app-store/admin/index.slice";
import { useDispatch, useSelector } from "react-redux";

import MyPageHeader from "components/MyPageHeader";

import Moment from "moment";
import React, { useEffect } from "react";
import { fetchBrands } from "api/admin/index.api";
import { useRouter } from "next/router";
import Loader from "components/Loader";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { AppLayout } from "components/AppLayout";

const columns = [
  {
    title: "Status",
    dataIndex: "id",
    key: "id",
    render: (val) => (val ? <ArrowsPointingOutIcon /> : ""),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      return text;
    },
  },
  {
    title: "Descriptiopn",
    dataIndex: "description",
    key: "description",
  },
];

export default function Customers() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const brands: any = useSelector(getBrands);
  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  const loadBrands = () => {
    setLoading(true);
    router.isReady &&
      fetchBrands().then((data) => {
        dispatch(setBrands(data));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBrands();
  }, [router.isReady]);

  return (
    <AppLayout>
      <MyPageHeader title={"Brands"} subtitle={""}></MyPageHeader>

      <Content style={{ padding: "16px 16px" }}>
        {loading ? (
          <Loader />
        ) : (
          <Table columns={columns} dataSource={brands} rowKey={"id"} />
        )}
      </Content>
    </AppLayout>
  );
}
