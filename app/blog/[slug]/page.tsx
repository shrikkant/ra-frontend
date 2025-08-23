import React from 'react'
import {type SanityDocument} from 'next-sanity'
import {client} from '../../../sanity/client'
import {notFound} from 'next/navigation'
import {Metadata} from 'next'
import BlogPostContent from '../../../components/blog/BlogPostContent'
import BlogPostSidebar from '../../../components/blog/BlogPostSidebar'
import RelatedPosts from '../../../components/blog/RelatedPosts'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

// Enhanced post query with all necessary data
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  body,
  short_desc,
  publishedAt,
  image,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "excerpt": pt::text(short_desc)[0...160],
  categories[]->{ title, slug },
  author->{ name, image, bio },
  "wordCount": length(pt::text(body))
}`

// Query for related posts
const RELATED_POSTS_QUERY = `*[
  _type == "post" 
  && slug.current != $slug 
  && count(categories[@._ref in *[_type == "post" && slug.current == $slug][0].categories[]._ref]) > 0
]|order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  short_desc,
  publishedAt,
  image,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "excerpt": pt::text(short_desc)[0...100]
}`

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null

interface PageProps {
  params: Promise<{slug: string}>
}

// Generate metadata for SEO
export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  
  const post = await client.fetch<SanityDocument>(POST_QUERY, {slug})
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const imageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(630).quality(90).url()
    : '/assets/v2/img/blog-og.jpg'

  return {
    title: `${post.title} | RentAcross Photography Blog`,
    description: post.excerpt || `Read ${post.title} on RentAcross Photography Blog. Expert tips and guides for photographers.`,
    keywords: `${post.title}, photography, camera rental, photography tips, ${post.categories?.map((c: any) => c.title).join(', ') || ''}`,
    authors: [{name: post.author?.name || 'RentAcross Team'}],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${post.slug.current}`,
      images: [
        {
          url: imageUrl || '/assets/v2/img/blog-og.jpg',
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'RentAcross Team']
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl || '/assets/v2/img/blog-og.jpg'],
      creator: '@rentacross'
    },
    alternates: {
      canonical: `/blog/${post.slug.current}`
    }
  }
}

export default async function BlogPostPage({params}: PageProps) {
  const {slug} = await params
  
  const [post, relatedPosts] = await Promise.all([
    client.fetch<SanityDocument>(POST_QUERY, {slug}),
    client.fetch<SanityDocument[]>(RELATED_POSTS_QUERY, {slug})
  ])

  if (!post) {
    notFound()
  }

  const imageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(600).quality(90).url()
    : null

  // Article structured data
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": imageUrl ? [imageUrl] : [],
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "RentAcross Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RentAcross",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rentacross.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rentacross.com/blog/${post.slug.current}`
    },
    "wordCount": post.wordCount,
    "articleSection": post.categories?.[0]?.title || "Photography",
    "keywords": post.categories?.map((c: any) => c.title).join(", ") || ""
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <article className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Article Content */}
            <main className="lg:col-span-3">
              <BlogPostContent post={post} />
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <BlogPostSidebar />
            </aside>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
              <RelatedPosts posts={relatedPosts} />
            </div>
          )}
        </article>
      </div>
    </>
  )
}