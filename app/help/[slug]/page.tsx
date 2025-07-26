/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  fetchBlogBySlugServer,
  fetchBlogsServer,
} from '../../../api/server-fetch'
import PageContainer from '../../../components/common/PageContainer'
import {ARTICLE_TYPES} from '../../../config/constants'
import BlogSideBar from '../../../components/blog/BlogSideBar'

interface PageProps {
  params: any
}

export default async function Blog({params}: PageProps) {
  const blogs = await fetchBlogsServer(1, 10, ARTICLE_TYPES.HELP_ARTICLE)

  const blog = await fetchBlogBySlugServer(params.slug)
  return (
    <>
      <PageContainer>
        <div className="flex gap-x-10 justify-center pt-4 ">
          <div className="basis-1/2">
            <div key={blog.id} className="post-item-cover">
              <h4 className="title title-line-left">
                <a href={`/blog/${blog.slug}`}>{blog.title}</a>
              </h4>
              <div className="post-content">
                <div className="text">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{__html: blog.content}}
                  ></div>
                </div>
              </div>
              <div className="post-footer">
                <a href={`/blog/${blog.slug}`} className="btn">
                  <span>more</span>
                </a>
              </div>
            </div>
          </div>
          <div className="basis-1/4">
            <BlogSideBar blogs={blogs} type={ARTICLE_TYPES.HELP_ARTICLE} />
          </div>
        </div>
      </PageContainer>
    </>
  )
}
