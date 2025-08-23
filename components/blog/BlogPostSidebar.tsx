import React from 'react'
import Link from 'next/link'
import DynamicBrowseLink from './DynamicBrowseLink'

const BlogPostSidebar: React.FC = () => {
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:sticky lg:top-8">
      <div className="space-y-8">
        {/* Table of Contents */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table of Contents
          </h3>
          <nav className="space-y-2">
            <a href="#introduction" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">
              1. Introduction
            </a>
            <a href="#getting-started" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">
              2. Getting Started
            </a>
            <a href="#tips-and-tricks" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">
              3. Tips and Tricks
            </a>
            <a href="#conclusion" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1">
              4. Conclusion
            </a>
          </nav>
        </div>

        {/* Camera Rental CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200">
          <div className="text-center">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Equipment?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Rent professional cameras and gear for your next project.
            </p>
            <DynamicBrowseLink className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm">
              Browse Equipment
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </DynamicBrowseLink>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Pro Tips
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-0.5">💡</span>
              <span className="text-gray-600">
                Always test your equipment before the actual shoot
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-0.5">🔋</span>
              <span className="text-gray-600">
                Bring extra batteries and memory cards
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-0.5">🌤️</span>
              <span className="text-gray-600">
                Golden hour provides the best natural lighting
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2 mt-0.5">🎯</span>
              <span className="text-gray-600">
                Focus on composition before camera settings
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Have questions about photography or our rental equipment?
          </p>
          <div className="space-y-2">
            <Link
              href="/contact"
              className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="block w-full text-center text-orange-600 hover:text-orange-700 transition-colors text-sm font-medium"
            >
              View Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostSidebar