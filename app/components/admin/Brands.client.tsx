"use client";
// import Table from "antd/lib/table/Table";


import {
  // getBrands,
  setBrands,
} from "app-store/admin/index.slice";
import {
  useDispatch,
  // useSelector
} from "react-redux";

import MyPageHeader from "components/MyPageHeader";

import React, { useEffect } from "react";
import { fetchBrands } from "api/admin/index.api";
import Loader from "components/Loader";

// const columns = [
//   {
//     title: "Brand",
//     dataIndex: "name",
//     key: "name",
//     render: (text) => {
//       return text;
//     },
//   },
//   {
//     title: "Descriptiopn",
//     dataIndex: "description",
//     key: "description",
//   },
// ];

export default function Brands() {
  const [loading, setLoading] = React.useState(false);

  // const brands = useSelector(getBrands);
  const dispatch = useDispatch();

  const loadBrands = () => {
    setLoading(true);

    fetchBrands().then((data) => {
      dispatch(setBrands(data));
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return (
    <>
      <MyPageHeader title={"Brands"}></MyPageHeader>

      <div className="p-4">
        {loading ? (
          <Loader />
        ) : (
          <div>TO_DO</div>
        )}
      </div>
    </>
  );
}
