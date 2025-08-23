'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {PortableText, type SanityDocument} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import {client} from '../../sanity/client'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

interface RelatedPostsProps {
  posts: Array<SanityDocument & {
    estimatedReadingTime?: number
    excerpt?: string
  }>
}

const RelatedPostCard: React.FC<{
  post: SanityDocument & {
    estimatedReadingTime?: number
    excerpt?: string
  }
}> = ({post}) => {
  const imageUrl = post.image
    ? urlFor(post.image)?.width(400).height(250).quality(80).url()
    : '/assets/v2/img/blog-placeholder.jpg'

  const readingTime = post.estimatedReadingTime || 3

  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.slug.current}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
              {post.title}
            </h3>

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
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 space-x-3">
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
              
              {/* Read More Arrow */}
              <div className="text-orange-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({posts}) => {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="mt-20 pt-16 border-t border-gray-200">
      <div className="max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Continue Reading
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more photography tips, camera reviews, and expert guides to enhance your skills
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RelatedPostCard key={post._id} post={post} />
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Articles
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RelatedPosts