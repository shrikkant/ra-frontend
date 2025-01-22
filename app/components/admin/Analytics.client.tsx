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

  const fetchData = async (year: number) => {
    const response: IProductRevene[] = await fetchAnalytics(year);
    setAnalytics(response);
  };

  useEffect(() => {
    if (!analytics) {
      fetchData(parseInt(year));
    }
  }, [analytics]);

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setYear(year);
    fetchData(parseInt(year));

    router.push("/p/admin/analytics?year=" + year);
    return;
  }

  return (
    <>
      <MyPageHeader title={"Analytics"}>
        <Select name="status" aria-label="Year"
          value={year}
          onChange={onYearChange}>
          <option value="-1">All Time</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </Select>
      </MyPageHeader>
      <div className="flex py-2 border-b border-b-gray-400 font-semibold">
        <div className="w-full">Product</div>
        <div>Revenue</div>
      </div>
      {analytics && analytics.map((item, index) => {
        return (
          <div key={index} className="gap-x-2 flex py-2 border-b border-b-gray-300">
            <div className="">{index + 1}.</div>
            <div className="w-full">{item.name}</div>
            <div className="text-right w-full">{item.revenue}</div>
          </div>
        )
      })}
    </>
  );
}
