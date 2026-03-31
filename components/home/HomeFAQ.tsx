'use client'

import React, {useState} from 'react'
import {faqs} from './faq-data'

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-100/80 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-[15px] font-medium pr-4 transition-colors duration-150 ${isOpen ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
          {question}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isOpen ? 'bg-[#f7ca00] text-gray-900 rotate-180' : 'bg-gray-100 text-gray-400'}`}>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section aria-label="Frequently asked questions" className="bg-[#fafaf8]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28 sm:py-20 sm:pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Common questions
        </h2>
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
