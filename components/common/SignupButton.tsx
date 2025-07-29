import React from 'react'
import UserIcon from '@heroicons/react/24/outline/UserIcon'

interface SignupButtonProps {
  onClick: () => void
}

export default function SignupButton({onClick}: SignupButtonProps) {
  return (
    <a
      href="#"
      onClick={onClick}
      className="border-2 justify-center items-center h-8 w-8 rounded-full border-[#FDC002] hover:border-[#E5C71F] hover:bg-[#FDC002]/10   font-semibold transition-all duration-300 ease-in-out flex  gap-1.5 xs:gap-2 text-sm xs:text-base hover:shadow-[0_0_8px_rgba(253,192,2,0.5)]"
    >
      <UserIcon className="h-4 w-4 xs:h-5 xs:w-5 text-[#FDC002] transition-colors duration-300 ease-in-out group-hover:text-[#E5C71F]" />
    </a>
  )
}
