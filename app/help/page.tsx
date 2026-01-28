import React from 'react'
import Link from 'next/link'
import {fetchBlogsServer} from '../../api/blog/blog.api'

// Generate on first request, then cache
export const dynamic = 'force-dynamic'
import BlogCover from '../../components/common/BlogCover'
import PageContainer from '../../components/common/PageContainer'
import {ARTICLE_TYPES} from '../../config/constants'
import BlogSideBar from '../../components/blog/BlogSideBar'

export default async function Help() {
  const blogs = await fetchBlogsServer(1, 10, ARTICLE_TYPES.HELP_ARTICLE)

  return (
    <>
      <section className="bg-[#192330] min-h-[100px] py-[30px] pb-[45px] flex items-center text-center relative overflow-hidden">
        <PageContainer>
          <h1 className="text-[#ffd910] leading-tight">Blog</h1>
          <ul className="breadcrambs">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Blog</li>
          </ul>
        </PageContainer>
      </section>

      <section className="py-24 relative z-10 text-center">
        <PageContainer>
          <div className="flex gap-x-10 justify-center">
            <div className="basis-1/2">
              <BlogCover blogs={blogs} />
            </div>

            <div className="basis-1/4">
              <BlogSideBar blogs={blogs} type={ARTICLE_TYPES.HELP_ARTICLE} />
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  )
}
