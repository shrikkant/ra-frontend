import { IBlog } from "../../app-store/app-defaults/types";
import Image from "next/image";


export default function BlogHeader({blog}:{blog:IBlog}) {

  const imgURL = (typeof (blog.content.split('src="')[1]) != 'undefined') ? (blog.content.split('src="')[1]).split('"')[0] : 'assets/v2/img/blog-1.jpg';

  const getAuthorName = (author) => {
    return author.firstname + ' ' + author.lastname;
  }


  return (<div className="post-header">
    <div className="post-thumbnail">
      <a href="single-news.html">
        <Image src={imgURL} alt="img" width={360} height={-1} />

      </a>
    </div>
    <div className="meta">
      <span className="post-date"><i className="fa fa-calendar" aria-hidden="true"></i>{blog.creationDate}</span>
      <span className="post-by"><i className="fa fa-user" aria-hidden="true"></i>By {getAuthorName(blog.author)}</span>
    </div>
  </div>)
}
