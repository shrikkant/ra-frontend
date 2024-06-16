import { fetchBlogs } from "../../api/products.api"
import BlogCover from "../../components/common/BlogCover";

export default async function Blog() {
  const blogs = await fetchBlogs(4);

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
            <BlogCover blogs={blogs} />

            <div className="pagination-cover">
              <ul className="pagination">
                <li className="pagination-item item-prev"><a href="#"><i className="fa fa-angle-left" aria-hidden="true"></i></a></li>
                <li className="pagination-item active"><a href="#">1</a></li>
                <li className="pagination-item"><a href="#">2</a></li>
                <li className="pagination-item"><a href="#">3</a></li>
                <li className="pagination-item"><a href="#">4</a></li>
                <li className="pagination-item"><a href="#">5</a></li>
                <li className="pagination-item item-next"><a href="#"><i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-lg-4 sidebar">
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
                    <a href="#"><img src="assets/v2/img/insta-widget-1.jpg" alt="img"/></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-2.jpg" alt="img"/></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-3.jpg" alt="img"/></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-4.jpg" alt="img"/></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-5.jpg" alt="img"/></a>
                  </li>
                  <li>
                    <a href="#"><img src="assets/v2/img/insta-widget-6.jpg" alt="img"/></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </>)
}
