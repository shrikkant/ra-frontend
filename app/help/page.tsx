import React from 'react'
import {fetchBlogs} from '../../api/blog/blog.api'
import BlogCover from '../../components/common/BlogCover'
import PageContainer from '../../components/common/PageContainer'
import {ARTICLE_TYPES} from '../../config/constants'
import BlogSideBar from '../../components/blog/BlogSideBar'

export default async function Help() {
  const blogs = await fetchBlogs(1, 10, ARTICLE_TYPES.HELP_ARTICLE)

  return (
    <>
      <section className="s-header-title">
        <PageContainer>
          <h1>Blog</h1>
          <ul className="breadcrambs">
            <li>
              <a href="/">Home</a>
            </li>
            <li>Blog</li>
          </ul>
        </PageContainer>
      </section>

      <section className="s-news">
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
