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

    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.order || 0) - (b.order || 0))
    })

    return grouped
  }, [faqs])

  const categories = Object.keys(categorizedFAQs).sort()

  if (faqs.length === 0) return null

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="space-y-3">
          {categories.map((category, index) => (
            <CategoryAccordion
              key={category}
              category={category}
              faqs={categorizedFAQs[category]}
              isDefaultOpen={index === 0}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Still have questions?{' '}
            <a href="/contact" className="text-gray-900 font-medium hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
