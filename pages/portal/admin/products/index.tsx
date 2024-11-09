

import MyPageHeader from "components/MyPageHeader";

import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { AppLayout } from "components/AppLayout";
import BulkUpload from "../../../../components/admin/BulkUpload";

export default function Customers() {
  const router = useRouter();

  useEffect(() => {

  }, [router.isReady]);

  return (
    <AppLayout>
      <MyPageHeader title={"Products"} subtitle={""}></MyPageHeader>

      <BulkUpload />

    </AppLayout>
  );
}
