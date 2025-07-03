/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {fetchBlogBySlug, fetchBlogs} from '../../../api/blog/blog.api'
import PageContainer from 'components/common/PageContainer'
import BlogSideBar from '../../../components/blog/BlogSideBar'
import {PortableText, type SanityDocument} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {client} from '../../../sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {IBlog} from '../../../app-store/app-defaults/types'

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`
const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

const options = {next: {revalidate: 30}}
interface PageProps {
  params: any
}

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, short_desc, publishedAt}`

export default async function Page({params}: PageProps) {
  const blogs = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options)

  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options,
  )
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null
  // const blog = await fetchBlogBySlug(params.slug)

  return (
    <section className="s-news">
      <PageContainer>
        <div className="flex gap-x-10 justify-center">
          <div className="basis-1/2">
            <div key={post._id} className="post-item-cover">
              {postImageUrl && (
                <Image
                  src={postImageUrl}
                  alt={post.title}
                  className="aspect-video rounded-xl "
                  width={760}
                  height={-1}
                  priority
                />
              )}
              <h1 className="title title-line-left mt-4">{post.title}</h1>
              <div className="post-content">
                <div className="text">
                  <p>
                    Published: {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  {Array.isArray(post.body) && (
                    <PortableText value={post.body} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="basis-1/4">
            <BlogSideBar blogs={blogs as unknown as IBlog[]} />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
