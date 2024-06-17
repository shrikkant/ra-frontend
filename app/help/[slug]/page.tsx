import { fetchBlogBySlug, fetchBlogs } from "../../../api/blog/blog.api";
import BlogCover from "../../../components/common/BlogCover"
import { ARTICLE_TYPES } from "../../../config/constants";


export default async function Blog({ params }: { params: { slug: string } }) {
  const blogs = await fetchBlogs(1, 10, ARTICLE_TYPES.HELP_ARTICLE);

  const blog = await fetchBlogBySlug(params.slug);
  return (<>

    <section className="s-header-title">
      <div className="container">
        <h1>Help</h1>
        <ul className="breadcrambs">
          <li><a href="/">Home</a></li>
          <li>Help</li>
        </ul>
      </div>
    </section>

    <section className="s-news">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8 blog-cover">
            <BlogCover blogs={[blog]} />
          </div>

          <div className="col-12 col-lg-4 sidebar">
            <a href="#" className="btn btn-sidebar"><span>Widgets</span></a>
            <ul className="widgets">

              <li className="widget widget-recent-posts">
                <h5 className="title">Help</h5>
                <ul>
                  {blogs.map(blog => {
                    return (<li>
                      <a href={"/help/" + blog.slug}>{blog.title}</a>
                      {/* <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>{blog.creationDate}</div> */}
                    </li>)
                  })}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </>)
}
