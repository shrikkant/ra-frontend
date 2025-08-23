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

interface BlogPostContentProps {
  post: SanityDocument & {
    estimatedReadingTime?: number
    wordCount?: number
    categories?: Array<{title: string; slug: {current: string}}>
    author?: {name: string; image?: any; bio?: string}
  }
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({post}) => {
  const imageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(600).quality(90).url()
    : null

  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image)?.width(64).height(64).quality(90).url()
    : null

  const readingTime = post.estimatedReadingTime || Math.ceil((post.wordCount || 1000) / 200)

  // Breadcrumb navigation
  const breadcrumbs = [
    {label: 'Home', href: '/'},
    {label: 'Blog', href: '/blog'},
    {label: post.title, href: '', current: true}
  ]

  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index}>
                <div className="flex items-center">
                  {index > 0 && (
                    <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.current ? (
                    <span className="text-gray-500 truncate max-w-40 lg:max-w-60">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-4xl">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/blog?category=${category.slug.current}`}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full hover:bg-orange-200 transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {readingTime} min read
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
              {post.wordCount || 'N/A'} words
            </div>
          </div>

          {/* Author Info */}
          {post.author && (
            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="flex items-center">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">Written by {post.author.name}</p>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {imageUrl && (
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl">
          <div className="prose prose-lg prose-gray max-w-none">
            <style jsx global>{`
              .prose {
                @apply text-gray-700 leading-relaxed;
              }
              .prose h2 {
                @apply text-2xl font-bold text-gray-900 mt-12 mb-6 border-b border-gray-200 pb-2;
              }
              .prose h3 {
                @apply text-xl font-semibold text-gray-900 mt-10 mb-4;
              }
              .prose h4 {
                @apply text-lg font-semibold text-gray-900 mt-8 mb-3;
              }
              .prose p {
                @apply mb-6 text-base leading-7;
              }
              .prose a {
                @apply text-orange-600 hover:text-orange-700 font-medium no-underline hover:underline transition-colors;
              }
              .prose ul {
                @apply my-6 space-y-2;
              }
              .prose li {
                @apply text-base leading-7;
              }
              .prose blockquote {
                @apply border-l-4 border-orange-400 pl-6 my-8 bg-orange-50 py-4 rounded-r-lg;
              }
              .prose blockquote p {
                @apply text-gray-700 italic mb-0;
              }
              .prose code {
                @apply bg-gray-100 text-orange-600 px-2 py-1 rounded text-sm font-mono;
              }
              .prose pre {
                @apply bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-8;
              }
              .prose pre code {
                @apply bg-transparent text-gray-100 p-0;
              }
              .prose img {
                @apply rounded-xl shadow-lg my-8;
              }
            `}</style>
            
            {Array.isArray(post.body) && (
              <PortableText value={post.body} />
            )}
          </div>

          {/* Social Share & Tags */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Share this article:</span>
                <div className="flex space-x-3">
                  <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <span className="sr-only">Share on Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                    <span className="sr-only">Share on Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                    <span className="sr-only">Share on LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Back to Blog */}
              <Link
                href="/blog"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostContent