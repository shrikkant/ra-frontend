import { Content } from "antd/lib/layout/layout";

import React from "react";
export default function Loader() {
  return (
    <Content style={{ height: 'calc(100vh - 140px)' }}>
      <div className="flex justify-center items-center h-full">
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-600 "
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">
            Loading...
          </span>
        </div>
      </div>
    </Content>
  );
}
