import React from "react";
export default function Layout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {

  return (<section className="container m-auto ">
    {children}
  </section>);
}
