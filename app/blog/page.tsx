
import React from "react";
import { fetchBlogs } from "../../api/blog/blog.api"
import BlogCover from "../../components/common/BlogCover";
import PageContainer from "../../components/common/PageContainer";


export default async function Blog() {
  const blogs = await fetchBlogs(0, 4, 0);

  return (<>
    <section className="s-header-title">
      <PageContainer>
        <h1>Blog</h1>
        <ul className="breadcrambs">
          <li><a href="/">Home</a></li>
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
            <a href="#" className="btn btn-sidebar"><span>Widgets</span></a>
            <ul className="widgets">

              <li className="widget widget-recent-posts">
                <h5 className="title">recent blog posts</h5>
                <ul>
                  <li>
                    <a href="#">Mobile App Design: From Beginner to Intermediate</a>
                    <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>Dec 27, 2019 at 5:47 pm</div>
                  </li>
                  <li>
                    <a href="#">Et harum quidem rerum facilis est et expedita distinctio</a>
                    <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>Dec 17, 2018 at 5:47 pm</div>
                  </li>
                  <li>
                    <a href="#">Nam libero tempore, cum soluta nobis est eligendi optio</a>
                    <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>Dec 8, 2018 at 5:47 pm</div>
                  </li>
                </ul>
              </li>

              <li className="widget widget-instagram">
                <h5 className="title">Instagram</h5>
                <ul>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-1.jpg" alt="img" /></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-2.jpg" alt="img" /></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-3.jpg" alt="img" /></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-4.jpg" alt="img" /></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-5.jpg" alt="img" /></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-6.jpg" alt="img" /></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </PageContainer>
    </section>
  </>)
}
