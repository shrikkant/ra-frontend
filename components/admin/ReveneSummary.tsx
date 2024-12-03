import React from "react";

interface RevenueSummaryProps {
  revenueStats: {
    overall: {
      cost_basis: number;
      net_revenue: number;
      orders: number;
      revenue: number;
    },
    stats: {
      revenue: {
        month: string;
        revenue: number;
        orders: number;
        cost_basis: number;
        net_revenue: number;
      }[]
    }
  }
};

export function RevenueSummary({ revenueStats }: RevenueSummaryProps) {
  const currentMonth = revenueStats.stats.revenue[0];
  const previousMonth = revenueStats.stats.revenue[1];
  const reveneGrowth =
    Math.round(((currentMonth.revenue / previousMonth.revenue) - 1) * 100);
  const ordersGrowth =
    Math.round(((currentMonth.orders / previousMonth.orders) - 1) * 100);



  return (<div className="flex gap-x-4 border border-gray-300 p-4 rounded-md">
    <div>
      <span className="text-2xl font-semibold text-green-600">
        &#8377;{currentMonth.revenue}
      </span>
      <span className={
        (reveneGrowth > 0 ? "text-green-400" : "text-red-500") +
        " pl-2 text-sm"
      }>
        {reveneGrowth}%
      </span>
    </div>
    <div>
      <span className="text-2xl font-semibold text-green-600">
        {currentMonth.orders}
      </span>
      <span className={
        (ordersGrowth > 0 ? "text-green-400" : "text-red-500") +
        "pl-2 text-sm"}>
        {ordersGrowth}%
      </span>
    </div>
  </div>)
}
