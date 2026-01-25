import React from 'react'

interface ToggleButtonProps {
  isActive: boolean
  isLoading: boolean
  onClick: () => void
  activeColor?: string
  inactiveColor?: string
  title?: string
  icon?: 'check' | 'star' | 'dash'
}

const icons = {
  check: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  dash: <span className="text-lg">-</span>,
}

export default function ToggleButton({
  isActive,
  isLoading,
  onClick,
  activeColor = 'bg-green-500 hover:bg-green-600',
  inactiveColor = 'bg-gray-200 hover:bg-gray-300',
  title,
  icon = 'check',
}: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        isLoading
          ? 'bg-gray-200 cursor-wait'
          : isActive
            ? `${activeColor} text-white`
            : `${inactiveColor} text-gray-400`
      }`}
      title={title}
    >
      {isLoading ? (
        <span className="animate-spin text-xs">...</span>
      ) : isActive ? (
        icons[icon]
      ) : (
        icons.dash
      )}
    </button>
  )
}
