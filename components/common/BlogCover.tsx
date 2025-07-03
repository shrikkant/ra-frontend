import {PortableText} from 'next-sanity'
import {IBlog} from '../../app-store/app-defaults/types'
import React from 'react'

export default function BlogCover({blogs}: {blogs: IBlog[]}) {
  return (
    <>
      {blogs &&
        blogs.map(blog => {
          return (
            <div key={blog._id} className="post-item-cover">
              <h4 className="title title-line-left">
                <a href={`/blog/${blog.slug.current}`}>{blog.title}</a>
              </h4>

              <div className="post-content">
                <div className="text">
                  {Array.isArray(blog.short_desc) && (
                    <PortableText value={blog.short_desc} />
                  )}
                </div>
              </div>

              <div className="post-footer">
                <a href={`/blog/${blog.slug.current}`} className="btn">
                  <span>more</span>
                </a>
              </div>
            </div>
          )
        })}
    </>
  )
}
