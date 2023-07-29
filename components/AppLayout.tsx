import { useState } from "react";
import AppNav from "./AppNav";
import { AppFooter } from "./footer";
import AppHeader from "./header";

export function AppLayout({ sidebar, children }) {
  const [isNavOpen, setIsNavOpen] = useState(sidebar);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <>
      <div className="main-content">
        <AppNav navState={isNavOpen} toggleNavState={toggleNav}></AppNav>
        <div className={"overflow-y-auto h-screen w-full"}>
          <AppHeader
            navState={isNavOpen}
            onNavStateChange={toggleNav}
          ></AppHeader>
          <div>{children}</div>
        </div>
      </div>

      <AppFooter></AppFooter>
    </>
  );
}
