import React from 'react'

const Wave = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="wave-glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
      </linearGradient>
    </defs>
    <path
      d="M0,50 C20,30 40,70 60,50 S80,30 100,50"
      fill="none"
      stroke="url(#wave-glow)"
      strokeWidth="0.5"
    >
      <animate
        attributeName="d"
        values="M0,50 C20,30 40,70 60,50 S80,30 100,50;M0,50 C20,70 40,30 60,50 S80,70 100,50;M0,50 C20,30 40,70 60,50 S80,30 100,50"
        dur="8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

export default function HomeAdvantages() {
  const advantages = [
    {
      title: 'Doorstep Pickup & Delivery',
      description: 'Convenient service right at your doorstep',
      step: '01',
    },
    {
      title: 'Affordable Rentals',
      description: 'Flexible rentals that fit your budget',
      step: '02',
    },
    {
      title: 'Well Maintained Equipment',
      description: 'We maintain all our equipment to the highest standards',
      step: '03',
    },
    {
      title: 'Hassle free booking experience',
      description: 'Simple and quick booking process',
      step: '04',
    },
  ]

  return (
    <section className="relative -mt-[30px] z-10 s-our-advantages">
      {/* Background with diagonal clip */}
      <div className="absolute inset-0 bg-[url('/assets/v2/img/bg-advantages.webp')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

      {/* Animated waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <Wave />
        </div>
        <div className="absolute top-1/3 left-0 w-full h-full opacity-20">
          <Wave />
        </div>
        <div className="absolute top-2/3 left-0 w-full h-full opacity-10">
          <Wave />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Us
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience the best rental service with our unique advantages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f7ca00]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
                <div className="flex flex-col">
                  {/* <span className="text-[#f7ca00] text-sm font-semibold mb-4">
                    {advantage.step}
                  </span> */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#f7ca00] transition-colors duration-300">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
