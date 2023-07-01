import { Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default function MyPageHeader({ title, subtitle }) {
  return (
    <PageHeader
      className="r-comp"
      ghost={false}
      onBack={() => window.history.back()}
      title={title}
      subTitle={subtitle}
      extra={[
        <Button key="2">Operation</Button>,
        <Button key="1" type="primary">
          Primary
        </Button>,
      ]}
    >
    </PageHeader>
  )
}
