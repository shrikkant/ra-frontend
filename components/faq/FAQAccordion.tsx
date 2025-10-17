'use client'
import React, {useState} from 'react'
import {PortableText} from 'next-sanity'
import {IFAQ} from '../../app-store/app-defaults/types'

interface FAQAccordionProps {
  faq: IFAQ
  isDefaultOpen?: boolean
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faq,
  isDefaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen)

  return (
    <div className="group border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between text-left hover:bg-gray-50/50 transition-colors duration-200 px-6 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900 pr-8 leading-relaxed group-hover:text-orange-700 transition-colors">
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 ml-6 h-7 w-7 flex items-center justify-center transition-transform duration-300 ${
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

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          <div className="prose prose-gray max-w-none">
            <style jsx global>{`
              .prose {
                @apply text-gray-600 leading-relaxed;
              }
              .prose p {
                @apply mb-4 text-base;
              }
              .prose a {
                @apply text-orange-600 hover:text-orange-700 font-medium no-underline hover:underline transition-colors;
              }
              .prose ul, .prose ol {
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
            {Array.isArray(faq.answer) && <PortableText value={faq.answer} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQAccordion
