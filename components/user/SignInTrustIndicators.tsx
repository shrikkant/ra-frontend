import React from 'react'

interface TrustIndicator {
  icon: React.ReactNode
  text: string
  color: string
}

const trustIndicators: TrustIndicator[] = [
  {
    icon: (
      <svg
        className="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'Secure',
    color: 'text-green-500',
  },
  {
    icon: (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'Quick',
    color: 'text-blue-500',
  },
  {
    icon: (
      <svg
        className="w-4 h-4 text-purple-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'Trusted',
    color: 'text-purple-500',
  },
]

export const SignInTrustIndicators: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        {trustIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center space-x-1">
            {indicator.icon}
            <span>{indicator.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
