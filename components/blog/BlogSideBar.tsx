import React from 'react'
import {IBlog} from '../../app-store/app-defaults/types'
import {ARTICLE_TYPES} from '../../config/constants'

interface BlogSideBarProps {
  blogs: IBlog[]
  type?: number
}
export default function BlogSideBar({
  blogs,
  type = ARTICLE_TYPES.BLOG,
}: BlogSideBarProps) {
  return (
    <>
      <a href="#" className="btn btn-sidebar">
        <span>Widgets</span>
      </a>
      <ul className="widgets">
        <li className="widget widget-recent-posts">
          <h5 className="title">
            {ARTICLE_TYPES.HELP_ARTICLE === type
              ? 'Help Articles'
              : 'Recent Posts'}
          </h5>
          <ul>
            {blogs &&
              blogs.map(blog => (
                <li key={blog.id}>
                  <a
                    href={`/${type === ARTICLE_TYPES.HELP_ARTICLE ? 'help' : 'blog'}/${blog.slug}`}
                  >
                    {blog.title}
                  </a>

                  {/* <div className="date"><i className="fa fa-calendar" aria-hidden="true"></i>
                {blog.creationDate}
              </div> */}
                </li>
              ))}
          </ul>
        </li>
      </ul>
    </>
  )
}
