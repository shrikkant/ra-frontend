import React from "react";
import PageContainer from "./PageContainer";

interface PageTitleProps {
  title: string;
}
export function PageTitle({ title }: PageTitleProps) {
  return (<section className="s-header-title">
    <PageContainer>
      <h1>{title}</h1>
      <ul className="breadcrambs">
        <li><a href="/">Home</a></li>
        <li>{title}  </li>
      </ul>
    </PageContainer>
  </section>);
}
