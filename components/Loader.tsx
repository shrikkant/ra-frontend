import { Content } from "antd/lib/layout/layout";

import React from "react";
export default function Loader() {
  return (
    <Content className="r-comp" style={{ height: "100vh" }}>
      <div className="flex justify-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-600 "
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </Content>
  );
}
