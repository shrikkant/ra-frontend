'use client'

import React, {useState} from 'react'
import {faqs} from './faq-data'
import FAQItem from '../common/FAQItem'

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
