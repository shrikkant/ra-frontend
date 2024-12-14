
import React from "react";
import Orders from "../../../components/admin/Orders.client";



interface PageProps {
  searchParams: any;
}

export default async function Page({ searchParams }: PageProps) {
  const localSearchParams = await searchParams;
  return (
    <Orders stage={localSearchParams.stage} />
  );
}
