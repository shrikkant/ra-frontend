import { Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default function MyPageHeader({...props}) {
  return (
    <PageHeader
      className="r-comp"
      ghost={false}
      onBack={() => window.history.back()}
      {...props}
    >
    </PageHeader>
  )
}
