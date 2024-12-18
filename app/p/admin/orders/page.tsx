
import React from "react";
import Orders from "../../../components/admin/Orders.client";



type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const stage = searchParams.stage ? parseInt(String(searchParams.stage)) : 0;
  return (
    <Orders stage={stage} />
  );
}
