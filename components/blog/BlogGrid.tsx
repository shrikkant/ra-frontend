'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {IBlog} from '../../app-store/app-defaults/types'
import {PortableText} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import {client} from '../../sanity/client'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

interface BlogGridProps {
  posts: Array<IBlog & {
    image?: any
    estimatedReadingTime?: number
    excerpt?: string
    categories?: Array<{title: string; slug: {current: string}}>
  }>
}

const BlogCard: React.FC<{
  post: IBlog & {
    image?: any
    estimatedReadingTime?: number
    excerpt?: string
    categories?: Array<{title: string; slug: {current: string}}>
  }
}> = ({post}) => {
  const imageUrl = post.image && urlFor(post.image)
    ? urlFor(post.image)?.width(400).height(250).quality(80).url() || '/assets/v2/img/banners/blog-1.webp'
    : '/assets/v2/img/banners/blog-1.webp'

  const readingTime = post.estimatedReadingTime || 3

  return (
    <article className="group bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden hover:shadow-2xl hover:shadow-orange-100/30 hover:border-orange-300/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm">
      {/* Image */}
      <Link href={`/blog/${post.slug.current}`}>
        <div className="relative h-48 overflow-hidden cursor-pointer">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/30 group-hover:to-transparent transition-all duration-500" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 group-hover:p-7 transition-all duration-300">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 1).map((category) => (
              <span
                key={category.slug.current}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200/50 hover:scale-105 transition-transform duration-200 shadow-sm"
              >
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug.current}`}>
          <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-500 cursor-pointer leading-tight tracking-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <div className="text-gray-600 mb-4 text-sm line-clamp-3">
          {post.excerpt ? (
            <p>{post.excerpt}</p>
          ) : (
            Array.isArray(post.short_desc) && (
              <div className="prose prose-sm max-w-none text-gray-600">
                <PortableText value={post.short_desc} />
              </div>
            )
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center text-xs text-gray-500 space-x-3 pt-4 border-t border-gray-100">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {readingTime} min
          </span>
        </div>
      </div>
    </article>
  )
}

const BlogGrid: React.FC<BlogGridProps> = ({posts}) => {
  return (
    <section id="latest-articles" className="mt-12">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
        <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
          <p className="text-gray-600">Check back soon for new photography tips and guides!</p>
        </div>
      ) : (
        <>
          {/* Main Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {/* Load More - Future Enhancement */}
          <div className="text-center">
            <button className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
              Load More Articles
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default BlogGrid