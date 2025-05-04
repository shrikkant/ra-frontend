import React from 'react'

interface ButtonProps {
  label: string | undefined
  variant: 'primary' | 'secondary'
  onClick: () => void
  disabled?: boolean | undefined
  isLoading?: boolean | undefined
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  onClick,
  disabled,
  isLoading,
}: ButtonProps) => {
  const primaryColor = 'bg-[#FFDC2DAD]'
  const secondaryColor = '#374151'

  const styles = {
    // backgroundColor: variant === 'primary' ? primaryColor : secondaryColor,
    color: variant === 'primary' ? '#555' : '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
  } as React.CSSProperties

  return (
    <button
      style={styles}
      onClick={onClick}
      className={`w-full px-4 ${variant === 'primary' && !disabled ? primaryColor : secondaryColor}
      ${disabled || isLoading ? `bg-gray-400 cursor-default` : `cursor-pointer hover:bg-[#E5C71F]`} py-2 rounded-md text-[#555] font-semibold relative disabled:text-white`}
      disabled={isLoading || disabled}
    >
      <span className="transition-opacity duration-200 ">
        {label ? label : 'Submit'}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-start pl-8">
          <div className="relative w-3 h-3">
            <div className="absolute w-full h-full border-2 border-amber-300 rounded-full animate-ripple"></div>
            <div className="absolute w-full h-full border-2 border-amber-300 rounded-full animate-ripple delay-300"></div>
            <div className="absolute w-full h-full border-2 border-amber-300 rounded-full animate-ripple delay-600"></div>
          </div>
        </div>
      )}
    </button>
  )
}

export default Button
