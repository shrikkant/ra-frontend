import React from "react";
import Link from "next/link";
import PageContainer from "./PageContainer";
import AppHeader from "../header";

export default function Header() {

  return (<div>
    <header className="header">
      <AppHeader></AppHeader>

      <div className="header-menu xs:hidden block">
        <PageContainer>
          <a href="/" className="logo"><img src="/assets/img/logo.png" alt="logo" /></a>
          <nav className="nav-menu">
            <ul className="nav-list">
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </nav>
        </PageContainer>
      </div>
    </header>
  </div>);

}
