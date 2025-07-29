import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {Provider} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'
import SignInRefactored from '../components/user/SignInRefactored'
import {SignInPhoneForm} from '../components/user/SignInPhoneForm'
import {SignInOTPForm} from '../components/user/SignInOTPForm'
import {SignInHeader} from '../components/user/SignInHeader'
import {SignInTrustIndicators} from '../components/user/SignInTrustIndicators'

// Mock the Redux store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (state = {user: null}, action: any) => state,
      session: (state = {utmData: null}, action: any) => state,
    },
  })
}

// Mock the API calls
jest.mock('../api/user/index.api', () => ({
  generateLoginOTP: jest.fn(),
  loginWithOTP: jest.fn(),
}))

// Mock the analytics
jest.mock('../utils/analytics', () => ({
  GA_EVENTS: {FORM_SUBMIT: 'form_submit', LOGIN: 'login'},
  trackGAEvent: jest.fn(),
}))

describe('SignInRefactored', () => {
  let mockStore: any

  beforeEach(() => {
    mockStore = createMockStore()
  })

  it('renders phone input form initially', () => {
    render(
      <Provider store={mockStore}>
        <SignInRefactored onClose={jest.fn()} />
      </Provider>,
    )

    expect(screen.getByText('Login or Signup')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter your 10-digit phone number'),
    ).toBeInTheDocument()
    expect(screen.getByText('Send OTP')).toBeInTheDocument()
  })

  it('shows validation error for invalid phone number', async () => {
    render(
      <Provider store={mockStore}>
        <SignInRefactored onClose={jest.fn()} />
      </Provider>,
    )

    const phoneInput = screen.getByPlaceholderText(
      'Enter your 10-digit phone number',
    )
    fireEvent.change(phoneInput, {target: {value: '123'}})

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument()
    })
  })
})

describe('SignInPhoneForm', () => {
  const mockProps = {
    phone: '',
    error: '',
    isLoading: false,
    isPhoneValid: false,
    onPhoneChange: jest.fn(),
    onSendOTP: jest.fn(),
  }

  it('renders phone input and send button', () => {
    render(<SignInPhoneForm {...mockProps} />)

    expect(screen.getByLabelText('Phone number')).toBeInTheDocument()
    expect(screen.getByText('Send OTP')).toBeInTheDocument()
  })

  it('calls onPhoneChange when phone input changes', () => {
    render(<SignInPhoneForm {...mockProps} />)

    const phoneInput = screen.getByLabelText('Phone number')
    fireEvent.change(phoneInput, {target: {value: '1234567890'}})

    expect(mockProps.onPhoneChange).toHaveBeenCalledWith('1234567890')
  })

  it('calls onSendOTP when send button is clicked', () => {
    render(<SignInPhoneForm {...mockProps} isPhoneValid={true} />)

    const sendButton = screen.getByText('Send OTP')
    fireEvent.click(sendButton)

    expect(mockProps.onSendOTP).toHaveBeenCalled()
  })

  it('disables send button when phone is invalid', () => {
    render(<SignInPhoneForm {...mockProps} isPhoneValid={false} />)

    const sendButton = screen.getByText('Send OTP')
    expect(sendButton).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<SignInPhoneForm {...mockProps} isLoading={true} />)

    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<SignInPhoneForm {...mockProps} error="Phone is required" />)

    expect(screen.getByText('Phone is required')).toBeInTheDocument()
  })
})

describe('SignInOTPForm', () => {
  const mockProps = {
    phone: '1234567890',
    otp: '',
    otpExpiry: 0,
    isLoading: false,
    onOtpChange: jest.fn(),
    onVerifyOTP: jest.fn(),
    onResendOTP: jest.fn(),
    onOtpTimeout: jest.fn(),
    onBackToPhone: jest.fn(),
  }

  it('renders OTP verification form', () => {
    render(<SignInOTPForm {...mockProps} />)

    expect(screen.getByText('Verify your phone')).toBeInTheDocument()
    expect(
      screen.getByText("We've sent a 6-digit code to 1234567890"),
    ).toBeInTheDocument()
    expect(screen.getByText('Verify & Continue')).toBeInTheDocument()
  })

  it('shows resend option when OTP expires', () => {
    render(<SignInOTPForm {...mockProps} otpExpiry={0} />)

    expect(screen.getByText("Didn't receive the code?")).toBeInTheDocument()
    expect(screen.getByText('Resend code')).toBeInTheDocument()
  })

  it('calls onResendOTP when resend is clicked', () => {
    render(<SignInOTPForm {...mockProps} otpExpiry={0} />)

    const resendButton = screen.getByText('Resend code')
    fireEvent.click(resendButton)

    expect(mockProps.onResendOTP).toHaveBeenCalled()
  })

  it('calls onBackToPhone when back button is clicked', () => {
    render(<SignInOTPForm {...mockProps} />)

    const backButton = screen.getByText('← Use different phone number')
    fireEvent.click(backButton)

    expect(mockProps.onBackToPhone).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<SignInOTPForm {...mockProps} isLoading={true} />)

    expect(screen.getByText('Verifying...')).toBeInTheDocument()
  })
})

describe('SignInHeader', () => {
  it('renders title', () => {
    render(<SignInHeader title="Test Title" />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<SignInHeader title="Test Title" subtitle="Test Subtitle" />)

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('applies centered class when isCentered is true', () => {
    render(<SignInHeader title="Test Title" isCentered={true} />)

    const header = screen.getByText('Test Title').closest('div')
    expect(header).toHaveClass('text-center')
  })
})

describe('SignInTrustIndicators', () => {
  it('renders all trust indicators', () => {
    render(<SignInTrustIndicators />)

    expect(screen.getByText('Secure')).toBeInTheDocument()
    expect(screen.getByText('Quick')).toBeInTheDocument()
    expect(screen.getByText('Trusted')).toBeInTheDocument()
  })
})
