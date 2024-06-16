import { fetchBlogs } from "../../api/products.api"
import BlogCover from "../../components/common/BlogCover";
import { ARTICLE_TYPES } from "../../config/constants";
import styles from "../../styles/help.module.css";

export default async function Help() {
  const blogs = await fetchBlogs(1, 10, ARTICLE_TYPES.HELP_ARTICLE);

  return (<>

    <section className="s-header-title">
      <div className="container">
        <h1>Blog</h1>
        <ul className="breadcrambs">
          <li><a href="/">Home</a></li>
          <li>Blog</li>
        </ul>
      </div>
    </section>

    <section className="s-news">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8 blog-cover">
            <BlogCover blogs={[blogs[0]]} />
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
