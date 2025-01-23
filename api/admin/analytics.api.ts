import httpClient from "../axios.config";

export interface IProductRevene {
  id: number;
  name: string;
  revenue: number;
  delivery_revenue: number;
  orders: number;
}

export async function fetchAnalytics(status: number, year: number, month: number): Promise<IProductRevene[]> {
  const analytics: IProductRevene[] = await httpClient.get(`/admin/revenue/analytics?status=${status}&year=${year}&month=${month}`);

  return analytics;
}

export async function fetchSignupAnalytics(): Promise<IProductRevene[]> {
  const analytics: IProductRevene[] = await httpClient.get(`/admin/revenue/analytics/signups`);

  return analytics;
}

