'use client'

import React, {useState} from 'react'
import {ChevronDownIcon} from '@heroicons/react/24/outline'
import type {FAQItem} from './Description'

interface FAQAccordionProps {
  faqs: FAQItem[]
}

const FAQAccordionItem: React.FC<{
  faq: FAQItem
  isOpen: boolean
  onToggle: () => void
}> = ({faq, isOpen, onToggle}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 lg:p-5 bg-white hover:bg-gray-50 transition-colors text-left"
    >
      <span className="text-gray-900 font-medium text-base lg:text-lg pr-4">
        {faq.question}
      </span>
      <ChevronDownIcon
        className={`w-5 h-5 lg:w-6 lg:h-6 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-96' : 'max-h-0'
      }`}
    >
      <div className="p-4 lg:p-5 pt-0 lg:pt-0 bg-gray-50">
        <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
          {faq.answer}
        </p>
      </div>
    </div>
  </div>
)

export const FAQAccordion: React.FC<FAQAccordionProps> = ({faqs}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      {faqs.map((faq, index) => (
        <FAQAccordionItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggleFAQ(index)}
        />
      ))}
    </div>
  )
}
