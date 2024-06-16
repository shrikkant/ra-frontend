import { IBlog } from "../../app-store/app-defaults/types";
import BlogHeader from "../blog/BlogHeader";
export default function BlogCover({ blogs }: { blogs: IBlog[] }) {


  return (<>
    {blogs && blogs.map(blog => {
      return (
        <div className="post-item-cover">
          <h4 className="title title-line-left"><a href="single-news.html">
            {blog.title}
          </a></h4>
          <div className="post-content">
            <div className="text">
              <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
            </div>
          </div>
          <div className="post-footer">
            <a href="single-news.html" className="btn"><span>more</span></a>
          </div>
        </div>
      )
    })}
  </>
  )
}
