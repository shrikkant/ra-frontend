import { IBlog } from "../../app-store/app-defaults/types";
import React from "react";

export default function BlogCover({ blogs }: { blogs: IBlog[] }) {

  return (<>
    {blogs && blogs.map(blog => {
      return (
        <div key={blog.id} className="post-item-cover">
          <h4 className="title title-line-left"><a href={`/blog/${blog.slug}`}>
            {blog.title}
          </a></h4>

          <div className="post-content">
            <div className="text">
              <div className="content" dangerouslySetInnerHTML={{ __html: blog.short_desc }}></div>
            </div>
          </div>

          <div className="post-footer">
            <a href={`/blog/${blog.slug}`} className="btn"><span>more</span></a>
          </div>
        </div>
      )
    })}
  </>
  )
}
