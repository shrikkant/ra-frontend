"use client"
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchAnalytics, IProductRevene } from "../../../api/admin/analytics.api";




export default function Analytics() {
  const [analytics, setAnalytics] = useState<IProductRevene[]>();

  useEffect(() => {
    const fetchData = async () => {
      const year = new Date().getFullYear() - 1;
      const response: IProductRevene[] = await fetchAnalytics(year);
      console.log("Response :::: ", response);
      setAnalytics(response);
    };
    fetchData();
  }, [analytics]);


  return (
    <>
      <MyPageHeader title={"Analytics"}></MyPageHeader>
      <div className="flex py-2 border-b border-b-gray-400 font-semibold">
        <div className="w-3/4">Product</div>
        <div>Revenue</div>
      </div>
      {analytics && analytics.map((item, index) => {
        return (
          <div key={index} className="flex py-2 border-b border-b-gray-300">
            <div className="w-3/4">{item.name}</div>
            <div>{item.revenue}</div>
          </div>
        )
      })}
    </>
  );
}
