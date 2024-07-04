import React from "react";
import { IBlog } from "../../app-store/app-defaults/types";

export default function BlogSideBar({ blogs }: { blogs: IBlog[] }) {


  return (<>
    <a href="#" className="btn btn-sidebar"><span>Widgets</span></a>
    <ul className="widgets">

      <li className="widget widget-recent-posts">
        <h5 className="title">recent blog posts</h5>
        <ul>
          {blogs && blogs.map((blog) =>
            <li key={blog.id}>
              <a href={`/blog/${blog.slug}`}>{blog.title}</a>
              <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>
                {blog.creationDate}
              </div>
            </li>

          )
          }
        </ul>
      </li>
    </ul>
  </>)
}
