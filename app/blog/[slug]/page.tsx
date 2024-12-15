/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { fetchBlogBySlug, fetchBlogs } from "../../../api/blog/blog.api";
import PageContainer from "components/common/PageContainer";
import BlogSideBar from "../../../components/blog/BlogSideBar";

interface PageProps {
  params: any;
}


export default async function Page({ params }: PageProps) {
  const blogs = await fetchBlogs(0, 5, 0);
  const blog = await fetchBlogBySlug(params.slug);


  return (

    <section className="s-news">
      <PageContainer>
        <div className="flex gap-x-10 justify-center">
          <div className="basis-1/2">
            <div key={blog.id} className="post-item-cover">
              <h4 className="title title-line-left"><a href={`/blog/${blog.slug}`}>
                {blog.title}
              </a></h4>
              <div className="post-content">
                <div className="text">
                  <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                </div>
              </div>
              <div className="post-footer">
                <a href={`/blog/${blog.slug}`} className="btn"><span>more</span></a>
              </div>
            </div>

          </div>
          <div className="basis-1/4">
            <BlogSideBar blogs={blogs} />
          </div>

        </div>
      </PageContainer>
    </section>
  )
}
