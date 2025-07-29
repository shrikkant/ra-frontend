export interface SignInModalProps {
  onClose: () => void
}

export interface SignInState {
  phone: string
  otp: string
  otpSent: boolean
  otpExpiry: number
  errors: {
    phone: string
  }
  isLoading: boolean
  isMobile: boolean
}

export interface SignInActions {
  setPhone: (phone: string) => void
  setOtp: (otp: string) => void
  setOtpSent: (otpSent: boolean) => void
  setOtpExpiry: (otpExpiry: number) => void
  setErrors: (errors: {phone: string}) => void
  setIsLoading: (isLoading: boolean) => void
  resetForm: () => void
}

export interface SignInHandlers {
  handlePhoneChange: (phone: string) => void
  handleOtpChange: (otp: string) => void
  resetOtpForm: () => void
  sendOTP: () => void
  verifyOTP: () => void
  handleGoogleSignIn: () => void
  onOtpTimeout: () => void
}

export interface SignInValidators {
  isPhoneValid: () => boolean
  hasErrors: () => boolean
}

export interface SignInHookReturn {
  state: SignInState
  actions: SignInActions
  handlers: SignInHandlers
  validators: SignInValidators
}