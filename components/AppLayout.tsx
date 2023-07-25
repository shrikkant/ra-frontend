import AppNav from "./AppNav";
import { AppFooter } from "./footer";
import AppHeader from "./header";

export function AppLayout({children, }) {

  return (
    <>
    <div className="main-content">
      <AppNav></AppNav>
      <div className={"right-panel"}>
      <AppHeader></AppHeader>
      <div>{children}</div>
      </div>
      </div>

      <AppFooter></AppFooter>
    </>
      );
}
