'use client'
import React, {useState} from 'react'
import {PortableText} from 'next-sanity'
import {IFAQ} from '../../app-store/app-defaults/types'

interface CategoryAccordionProps {
  category: string
  faqs: IFAQ[]
  isDefaultOpen?: boolean
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  faqs,
  isDefaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen)

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Category Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200'
                : 'bg-gray-100'
            }`}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isOpen ? 'text-white' : 'text-gray-600'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {faqs.length} {faqs.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
        </div>
        <span
          className={`flex-shrink-0 ml-6 h-8 w-8 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <svg
            className="h-6 w-6 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Category Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {isOpen && (
          <div className="px-6 pb-6 pt-2 space-y-8 bg-gradient-to-b from-gray-50/50 to-white">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className={`${
                index !== 0 ? 'pt-8 border-t border-gray-200' : ''
              }`}
            >
              {/* Question */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">Q</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 leading-relaxed pt-0.5">
                  {faq.question}
                </h4>
              </div>

              {/* Answer */}
              <div className="flex items-start space-x-3 ml-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">A</span>
                </div>
                <div className="flex-1 prose prose-gray max-w-none pt-0.5">
                  <style jsx global>{`
                    .prose {
                      @apply text-gray-700 leading-relaxed;
                    }
                    .prose p {
                      @apply mb-4 text-base;
                    }
                    .prose p:last-child {
                      @apply mb-0;
                    }
                    .prose a {
                      @apply text-orange-600 hover:text-orange-700 font-medium no-underline hover:underline transition-colors;
                    }
                    .prose ul,
                    .prose ol {
                      @apply my-4 space-y-2;
                    }
                    .prose li {
                      @apply text-base leading-7;
                    }
                    .prose strong {
                      @apply text-gray-900 font-semibold;
                    }
                    .prose em {
                      @apply text-gray-700;
                    }
                    .prose code {
                      @apply bg-gray-100 text-orange-600 px-2 py-1 rounded text-sm font-mono;
                    }
                    .prose h3 {
                      @apply text-lg font-semibold text-gray-900 mt-6 mb-3;
                    }
                    .prose h4 {
                      @apply text-base font-semibold text-gray-900 mt-4 mb-2;
                    }
                  `}</style>
                  {Array.isArray(faq.answer) && (
                    <PortableText value={faq.answer} />
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryAccordion
