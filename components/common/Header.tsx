"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageContainer from "./PageContainer";
import AppNav from "../AppNav";
import AppHeader from "../header";

export default function Header({ sidebar = false, header = true }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };


  return (<div>

    <AppNav navState={isNavOpen} toggleNavState={toggleNav}></AppNav>
    <header className="header">
      {header && <AppHeader
        navState={isNavOpen}
        onNavStateChange={toggleNav}
      ></AppHeader>}

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
