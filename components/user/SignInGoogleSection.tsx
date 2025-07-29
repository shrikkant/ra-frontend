import React from 'react'
import GoogleSignInButton from '../common/GoogleSignInBtn'

interface SignInGoogleSectionProps {
  onGoogleSignIn: () => void
}

export const SignInGoogleSection: React.FC<SignInGoogleSectionProps> = ({
  onGoogleSignIn,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <div className="text-center">
        <GoogleSignInButton onClick={onGoogleSignIn} />
      </div>
    </div>
  )
}
