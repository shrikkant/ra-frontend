import React from 'react'
import {client} from '../../sanity/client'
import {type SanityDocument} from 'next-sanity'
import {IBlog} from '../../app-store/app-defaults/types'
import {Metadata} from 'next'
import BlogHero from '../../components/blog/BlogHero'
import FeaturedPost from '../../components/blog/FeaturedPost'
import BlogGrid from '../../components/blog/BlogGrid'
import BlogCategories from '../../components/blog/BlogCategories'

// Enhanced query to get all necessary blog data including images
const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, 
  title, 
  slug, 
  short_desc, 
  publishedAt,
  image,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "excerpt": pt::text(short_desc)[0...150],
  categories[]->{ title, slug }
}`

// SEO metadata
export const metadata: Metadata = {
  title: 'Photography & Camera Rental Blog | Expert Tips & Guides | RentAcross',
  description: 'Discover expert photography tips, camera gear guides, and rental advice on the RentAcross blog. Learn from professionals and elevate your photography skills.',
  keywords: 'photography blog, camera rental, photography tips, camera gear, DSLR guides, photography tutorials',
  openGraph: {
    title: 'Photography Blog | RentAcross',
    description: 'Expert photography tips, camera reviews, and rental guides',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/assets/v2/img/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'RentAcross Photography Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography Blog | RentAcross',
    description: 'Expert photography tips, camera reviews, and rental guides',
    images: ['/assets/v2/img/blog-og.jpg']
  },
  alternates: {
    canonical: '/blog'
  }
}

// JSON-LD structured data
const blogStructuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "RentAcross Photography Blog",
  "description": "Expert photography tips, camera gear guides, and rental advice",
  "url": "https://rentacross.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "RentAcross",
    "logo": {
      "@type": "ImageObject",
      "url": "https://rentacross.com/logo.png"
    }
  }
}

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(
    POSTS_QUERY,
    {},
    {
      next: {
        revalidate: 3600, // Revalidate every hour for better performance
      },
    },
  )

  const transformedPosts = posts as unknown as IBlog[]
  const featuredPost = transformedPosts[0] // First post as featured
  const remainingPosts = transformedPosts.slice(1)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />

      {/* Modern Blog Hero Section */}
      <BlogHero />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Featured Post Section */}
          {featuredPost && (
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Article</h2>
                <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-orange-400 to-transparent"></div>
              </div>
              <FeaturedPost post={featuredPost} />
            </section>
          )}

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Categories Filter */}
              <BlogCategories posts={transformedPosts} />
              
              {/* Blog Grid */}
              <BlogGrid posts={remainingPosts} />
            </main>

            {/* Enhanced Sidebar */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <div className="sticky top-8 space-y-8">
                {/* Popular Posts */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100/80 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-2xl font-black text-gray-900">
                      Popular Posts
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {transformedPosts.slice(0, 5).map((post) => (
                      <a
                        key={post._id}
                        href={`/blog/${post.slug.current}`}
                        className="group block hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-25 p-3 -m-3 rounded-2xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-orange-200/50"
                      >
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-700 line-clamp-2 leading-tight mb-2 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Photography Tips */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-2xl font-black text-gray-900">
                      Pro Tips
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="group flex items-start p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-md">
                      <svg className="w-5 h-5 mr-4 mt-0.5 text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Always check your camera settings before a shoot
                      </span>
                    </li>
                    <li className="group flex items-start p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-md">
                      <svg className="w-5 h-5 mr-4 mt-0.5 text-yellow-500 group-hover:text-yellow-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Use natural light whenever possible
                      </span>
                    </li>
                    <li className="group flex items-start p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-md">
                      <svg className="w-5 h-5 mr-4 mt-0.5 text-purple-500 group-hover:text-purple-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Focus on composition over equipment
                      </span>
                    </li>
                    <li className="group flex items-start p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-md">
                      <svg className="w-5 h-5 mr-4 mt-0.5 text-gray-500 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Regular equipment maintenance is crucial
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}