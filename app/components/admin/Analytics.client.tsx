"use client"
import React, { useEffect, useState } from "react";

import { fetchAnalytics, IProductRevene } from "../../../api/admin/analytics.api";
import { Select } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";




export default function Analytics() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [year, setYear] = useState(searchParams.get("year") || "2025");
  const [month, setMonth] = useState(searchParams.get("month") || "-1");
  const [status, setStatus] = useState(searchParams.get("status") || "1");
  const [analytics, setAnalytics] = useState<IProductRevene[] | null>();

  const fetchData = async (status: number, year: number, month: number) => {
    const response: IProductRevene[] = await fetchAnalytics(status, year, month);
    setAnalytics(response);
  };

  useEffect(() => {
    if (!analytics) {
      fetchData(parseInt(status), parseInt(year), parseInt(month));
    }
  }, [analytics]);

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setYear(year);
    fetchData(parseInt(status), parseInt(year), parseInt(month));

    router.push("/p/admin/analytics?year=" + year);
    return;
  }

  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setMonth(month);
    fetchData(parseInt(status), parseInt(year), parseInt(month));
    router.push("/p/admin/analytics?year=" + year + "&month=" + month);
    return;
  }

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatus(status);
    fetchData(parseInt(status), parseInt(month), parseInt(status));
    router.push("/p/admin/analytics?year=" + year + "&month=" + month + "&status=" + status);
    return;
  }

  return (
    <>
      <div>
        <div className="flex gap-x-2 justify-end">
          <Select name="status" aria-label="Status"
            value={status}
            onChange={onStatusChange}>
            <option value="1">Paid</option>
            <option value="0">Unpaid</option>
          </Select>
          <Select name="status" aria-label="Year"
            value={year}
            onChange={onYearChange}>
            <option value="-1">All Time</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </Select>
          <Select name="status" aria-label="Month"
            value={month}
            onChange={onMonthChange}>
            <option value="-1">Full Year</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Ma</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </Select>
        </div>

      </div>
      <div className="flex gap-x-2 py-2 border-b border-b-gray-400 font-semibold">
        <div className="">#</div>
        <div className="w-full">Product</div>
        <div className="w-24 text-right">Orders</div>
        <div className="w-24 text-right">Days</div>
        <div className="w-24 text-right">Revenue</div>
      </div>
      {analytics && analytics.map((item, index) => {
        return (
          <div key={index}
            className={`gap-x-2 flex py-2 border-b ` + ((index === analytics.length - 1) ? "border-b-gray-400" : "border-b-gray-300")}>
            <div className="">{index + 1}.</div>
            <div className="w-full">{item.name}</div>
            <div className="text-right w-24">{item.orders}</div>
            <div className="text-right w-24">{item.rental_days}</div>
            <div className="text-right w-24">{item.revenue}</div>
          </div>
        )
      })}

      {analytics &&
        <div className="flex gap-x-2 py-2 font-semibold">
          {/* <div className=""></div> */}
          <div className="w-full">Total</div>
          <div className="w-24 text-right">{analytics.reduce((acc, item) => Number(acc) + (item.orders), 0)}</div>
          <div className="w-24 text-right">{analytics.reduce((acc, item) => Number(acc) + (item.rental_days), 0)}</div>
          <div className="w-24 text-right">{analytics.reduce((acc, item) => Number(acc) + Number(item.revenue), 0)}</div>
        </div>
      }
    </>);
}
