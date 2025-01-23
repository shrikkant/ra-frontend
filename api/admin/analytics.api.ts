import httpClient from "../axios.config";

export interface IProductRevene {
  id: number;
  name: string;
  revenue: number;
  delivery_revenue: number;
  orders: number;
}

export async function fetchAnalytics(year: number, month: number): Promise<IProductRevene[]> {
  const analytics: IProductRevene[] = await httpClient.get(`/admin/revenue/analytics?year=${year}&month=${month}`);

  return analytics;
}
