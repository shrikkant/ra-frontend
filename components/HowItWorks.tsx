import React from 'react'

const steps = [
  {
    step: '1',
    title: 'Browse & pick',
    description: 'Find your gear from our catalog of cameras, lenses, and accessories.',
  },
  {
    step: '2',
    title: 'Quick KYC',
    description: 'One-time verification in under 10 minutes. Simple, secure, done.',
  },
  {
    step: '3',
    title: 'We deliver',
    description: 'Gear arrives at your doorstep a day before your rental starts.',
  },
  {
    step: '4',
    title: 'Shoot & return',
    description: 'Create your content. Return next morning after your end date — no rush.',
  },
]

export default function HowItWorks() {
  return (
    <section aria-label="How it works" className="py-12 md:py-16">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
        How it works
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {steps.map(s => (
          <div key={s.step} className="group">
            <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center mb-3 group-hover:bg-[#f7ca00] group-hover:text-gray-900 transition-colors duration-200">
              {s.step}
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
