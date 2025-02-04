
import React from "react";
import { fetchBlogs } from "../../api/blog/blog.api"
import BlogCover from "../../components/common/BlogCover";
import PageContainer from "../../components/common/PageContainer";
import BlogSideBar from "../../components/blog/BlogSideBar";


export default async function Blog() {
  const blogs = await fetchBlogs(0, 8, 0);

  return (<>
    <section className="s-header-title">
      <PageContainer>
        <h4>Blog</h4>
      </PageContainer>
    </section>

    <section className="s-news">
      <PageContainer>
        <div className="flex gap-x-10 justify-center">
          <div className="basis-1/2">
            <BlogCover blogs={blogs.splice(4)} />
          </div>

          <div className="basis-1/4">
            <BlogSideBar blogs={blogs} />
          </div>
        </div>
      </PageContainer>
    </section>
  </>)
}
