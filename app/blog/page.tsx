import React from 'react'
import {fetchBlogs} from '../../api/blog/blog.api'
import BlogCover from '../../components/common/BlogCover'
import PageContainer from '../../components/common/PageContainer'
import BlogSideBar from '../../components/blog/BlogSideBar'
import {client} from '../../sanity/client'
import {type SanityDocument} from 'next-sanity'
import {IBlog} from '../../app-store/app-defaults/types'

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, short_desc, publishedAt}`

export default async function Blog() {
  const posts = await client.fetch<SanityDocument[]>(
    POSTS_QUERY,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  )

  return (
    <>
      <section className="bg-[#192330] min-h-[100px] py-[30px] pb-[45px] flex items-center text-center relative overflow-hidden">
        <PageContainer>
          <h4 className="text-[#ffd910] leading-tight">Blog</h4>
        </PageContainer>
      </section>

      <section className="py-24 relative z-10 text-center">
        <PageContainer>
          <div className="flex gap-x-10 justify-center">
            <div className="basis-1/2">
              <BlogCover blogs={posts as unknown as IBlog[]} />
            </div>

            <div className="basis-1/4">
              <BlogSideBar blogs={posts as unknown as IBlog[]} />
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  )
}
