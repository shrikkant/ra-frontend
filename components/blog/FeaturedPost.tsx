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

interface FeaturedPostProps {
  post: IBlog & {
    image?: any
    estimatedReadingTime?: number
    excerpt?: string
    categories?: Array<{title: string; slug: {current: string}}>
  }
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({post}) => {
  const imageUrl = post.image
    ? urlFor(post.image)?.width(800).height(450).quality(90).url()
    : '/assets/v2/img/blog-placeholder.jpg'

  const readingTime = post.estimatedReadingTime || 5

  return (
    <article className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-700 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100/50">
      <div className="lg:flex">
        {/* Image Section */}
        <div className="lg:w-1/2">
          <Link href={`/blog/${post.slug.current}`}>
            <div className="relative h-64 lg:h-full min-h-[300px] group cursor-pointer">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/20 group-hover:to-orange-600/20 transition-all duration-700"></div>
              
              {/* Featured Badge */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white text-sm font-bold rounded-full shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300">
                  <span className="mr-2 text-base animate-pulse">⭐</span>
                  <span className="uppercase tracking-wide">Featured</span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.slug.current}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link href={`/blog/${post.slug.current}`}>
            <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-6 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-700 transition-all duration-500 line-clamp-3 cursor-pointer leading-tight tracking-tight">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <div className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {post.excerpt ? (
              <p>{post.excerpt}</p>
            ) : (
              Array.isArray(post.short_desc) && (
                <div className="prose prose-sm max-w-none">
                  <PortableText value={post.short_desc} />
                </div>
              )
            )}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {readingTime} min read
              </span>
            </div>
          </div>

          {/* Read More Button */}
          <Link
            href={`/blog/${post.slug.current}`}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold rounded-2xl hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1 hover:scale-105 w-fit relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative font-black uppercase tracking-wide">Read Full Article</span>
            <svg 
              className="relative ml-3 w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default FeaturedPost