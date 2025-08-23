'use client'
import React, {useState} from 'react'
import {IBlog} from '../../app-store/app-defaults/types'

interface BlogCategoriesProps {
  posts: Array<IBlog & {
    categories?: Array<{title: string; slug: {current: string}}>
  }>
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({posts}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Extract unique categories from posts
  const allCategories = posts.flatMap(post => post.categories || [])
  const uniqueCategories = allCategories.reduce((acc, category) => {
    const exists = acc.find(c => c.slug.current === category.slug.current)
    if (!exists) {
      acc.push(category)
    }
    return acc
  }, [] as Array<{title: string; slug: {current: string}}>)

  const categories = [
    {title: 'All Articles', slug: {current: 'all'}},
    ...uniqueCategories.slice(0, 6) // Limit to 6 categories for better UX
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.slug.current}
            onClick={() => setActiveCategory(category.slug.current)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.slug.current
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Category Stats */}
      {uniqueCategories.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🏷️</div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {posts.length} articles across {uniqueCategories.length} categories
                </p>
                <p className="text-xs text-gray-600">
                  Find tutorials, reviews, and tips for your photography journey
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              {uniqueCategories.slice(0, 3).map((category, index) => (
                <span
                  key={category.slug.current}
                  className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-80"
                  style={{animationDelay: `${index * 0.2}s`}}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogCategories