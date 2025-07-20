import React from 'react'
import PageContainer from './PageContainer'

interface PageTitleProps {
  title: string
}
export function PageTitle({title}: PageTitleProps) {
  return (
    <section className="bg-[#192330] min-h-[100px] py-[30px] pb-[45px] flex items-center text-center relative overflow-hidden">
      <PageContainer>
        <h4 className="text-[#ffd910] leading-tight">{title}</h4>
        {/* <ul className="breadcrambs">
        <li><a href="/">Home</a></li>
        <li>{title}  </li>
      </ul> */}
      </PageContainer>
    </section>
  )
}
