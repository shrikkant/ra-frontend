"use client"
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchAnalytics, IProductRevene } from "../../../api/admin/analytics.api";
import { Select } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";




export default function Analytics() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [year, setYear] = useState(searchParams.get("year") || "2025");
  const [analytics, setAnalytics] = useState<IProductRevene[] | null>();

  useEffect(() => {
    const fetchData = async () => {
      const response: IProductRevene[] = await fetchAnalytics(parseInt(year));
      setAnalytics(response);
    };
    if (!analytics || analytics.length === 0) {
      fetchData();
    }
  }, [analytics, year]);

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setAnalytics(null);
    router.push("/p/admin/analytics?year=" + year);
    return;
  }

  return (
    <>
      <MyPageHeader title={"Analytics"}>
        <Select name="status" aria-label="Year" onChange={onYearChange}>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </Select>
      </MyPageHeader>
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
