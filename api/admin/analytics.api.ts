import httpClient from "../axios.config";

export interface IProductRevene {
  id: number;
  name: string;
  revenue: number;
  rental_days: number;
  delivery_revenue: number;
  orders: number;
}

export interface IMonthlyTrendData {
  "2022"?: number;
  "2023"?: number;
  "2024"?: number;
  "2025"?: number;
  name: string;
  id: number;
}

export async function fetchAnalytics(status: number, year: number, month: number): Promise<IProductRevene[]> {
  const analytics: IProductRevene[] = await httpClient.get(`/admin/revenue/analytics?status=${status}&year=${year}&month=${month}`);

  return analytics;
}

export async function fetchSignupAnalytics(): Promise<IMonthlyTrendData[]> {
  const analytics: IMonthlyTrendData[] = await httpClient.get(`/admin/revenue/analytics/signups`);

  return analytics;
}

export async function fetchOrderAnalytics(): Promise<IMonthlyTrendData[]> {
  const analytics: IMonthlyTrendData[] = await httpClient.get(`/admin/revenue/analytics/orders`);

  return analytics;
}

