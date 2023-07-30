import { useState } from "react";
import AppNav from "./AppNav";
import { AppFooter } from "./footer";
import AppHeader from "./header";

export function AppLayout({ sidebar = false, children }) {
  const [isNavOpen, setIsNavOpen] = useState(sidebar);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  console.log("isNav >> : ", isNavOpen);
  return (
    <>
      <div className="main-content">
        <AppNav navState={isNavOpen} toggleNavState={toggleNav}></AppNav>
        <div className={"overflow-y-auto h-screen w-full"}>
          <div>{isNavOpen}</div>
          <AppHeader
            navState={isNavOpen}
            onNavStateChange={toggleNav}
          ></AppHeader>
          <div
            className={
              "fixed h-screen w-screen bg-slate-900 z-[200] top-0 bg-opacity-60 " +
              (isNavOpen ? "block": "hidden")
            }
          ></div>
          <div>{children}</div>
        </div>
      </div>

      <AppFooter></AppFooter>
    </>
  );
}
