import React from "react";
import MasterProductDetails from "../../../../components/admin/MasterProductDetails.client";

type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
  const params = await props.params

  return (
    <MasterProductDetails id={params.id} />
  );
}
