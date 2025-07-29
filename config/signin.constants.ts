export const SIGNIN_CONSTANTS = {
  PHONE: {
    MAX_LENGTH: 10,
    PLACEHOLDER: 'Enter your 10-digit phone number',
    LABEL: 'Phone number',
  },
  OTP: {
    LENGTH: 6,
    EXPIRY_DEFAULT: 0,
  },
  BUTTONS: {
    SEND_OTP: 'Send OTP',
    SENDING: 'Sending...',
    VERIFY: 'Verify & Continue',
    VERIFYING: 'Verifying...',
  },
  TITLES: {
    WELCOME: 'Welcome',
    VERIFY_OTP: 'Verify OTP',
    LOGIN_SIGNUP: 'Login or Signup',
    VERIFY_PHONE: 'Verify your phone',
  },
  MESSAGES: {
    OTP_SENT: "We've sent a 6-digit code to",
    RESEND_CODE: "Didn't receive the code?",
    RESEND_LINK: 'Resend code',
    BACK_TO_PHONE: '← Use different phone number',
  },
  BREAKPOINTS: {
    MOBILE: 768,
  },
} as const

export const TRUST_INDICATORS = [
  {
    icon: 'check-circle',
    text: 'Secure',
    color: 'text-green-500',
  },
  {
    icon: 'check-circle',
    text: 'Quick',
    color: 'text-blue-500',
  },
  {
    icon: 'check-circle',
    text: 'Trusted',
    color: 'text-purple-500',
  },
] as const
