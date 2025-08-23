import React from 'react'
import Link from 'next/link'
import DynamicBrowseLink from './DynamicBrowseLink'

const BlogHero: React.FC = () => {
  
  return (
    <section className="relative bg-gray-900 overflow-hidden min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/v2/img/banners/blog-1.webp"
          alt="Photography landscape"
          className="w-full h-full object-cover"
        />
        {/* Enhanced overlay for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/85"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full mb-8 shadow-2xl border border-white/20 hover:scale-105 hover:bg-white/15 transition-all duration-300">
            <svg className="mr-3 w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Travel & Photography Blog</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            <span className="inline-block hover:scale-105 transition-transform duration-500">Master Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-300 hover:to-orange-700 transition-all duration-700">
              Photography
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed">
            Discover expert tips, camera gear reviews, and professional insights 
            to elevate your photography skills and make the most of your rental equipment.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="#latest-articles"
              className="group relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white px-10 py-4 rounded-2xl font-bold hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center">
                Start Reading
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <DynamicBrowseLink className="group border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-orange-400 backdrop-blur-sm transition-all duration-500 transform hover:-translate-y-1">
              <span className="flex items-center">
                Browse Gear
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </DynamicBrowseLink>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,90.7C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  )
}

export default BlogHero