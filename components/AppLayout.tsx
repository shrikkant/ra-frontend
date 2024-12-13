import React from "react";

import AppHeader from "./header";
import Scripts from "./common/Scripts";

interface AppLayoutProps {
  children: React.ReactNode;
  header?: boolean;
}

export function AppLayout({ children, header = true }: AppLayoutProps) {

  return (
    <>
      <div className="main-content">

        <div className={"overflow-y-auto h-screen w-full"}>
          {header && <AppHeader />}
          <div style={{ maxWidth: 1280, margin: "auto" }}>
            {children}
          </div>
        </div>
      </div>
      <Scripts />
    </>
  );
}
