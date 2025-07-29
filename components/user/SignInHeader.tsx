import React from 'react'

interface SignInHeaderProps {
  title: string
  subtitle?: string
  isCentered?: boolean
}

export const SignInHeader: React.FC<SignInHeaderProps> = ({
  title,
  subtitle,
  isCentered = false,
}) => {
  const containerClass = isCentered
    ? 'text-center space-y-2'
    : 'text-left space-y-2'

  return (
    <div className={containerClass}>
      <h1 className="text-lg font-normal text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
    </div>
  )
}
