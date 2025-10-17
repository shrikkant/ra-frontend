'use client'
import React, {useMemo} from 'react'
import {IFAQ} from '../../app-store/app-defaults/types'
import CategoryAccordion from './CategoryAccordion'

interface FAQSectionProps {
  faqs: IFAQ[]
  title?: string
  subtitle?: string
  className?: string
}

const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about our camera rental service',
  className = '',
}) => {
  // Group FAQs by category
  const categorizedFAQs = useMemo(() => {
    const grouped = faqs.reduce(
      (acc, faq) => {
        const category = faq.category || 'General'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(faq)
        return acc
      },
      {} as Record<string, IFAQ[]>,
    )

    // Sort FAQs within each category by order field
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => (a.order || 0) - (b.order || 0))
    })

    return grouped
  }, [faqs])

  const categories = Object.keys(categorizedFAQs).sort()

  if (faqs.length === 0) {
    return null
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Category Accordions */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <CategoryAccordion
              key={category}
              category={category}
              faqs={categorizedFAQs[category]}
              isDefaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Contact Support
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
