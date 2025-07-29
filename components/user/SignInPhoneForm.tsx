import React from 'react'
import Input from '../common/form/Input'
import Button from '../common/form/Button'
import {INPUT_ICON_TYPES} from '../../config/constants'

interface SignInPhoneFormProps {
  phone: string
  error: string
  isLoading: boolean
  isPhoneValid: boolean
  onPhoneChange: (phone: string) => void
  onSendOTP: () => void
}

export const SignInPhoneForm: React.FC<SignInPhoneFormProps> = ({
  phone,
  error,
  isLoading,
  isPhoneValid,
  onPhoneChange,
  onSendOTP,
}) => {
  return (
    <div className="space-y-4">
      <Input
        name="phone"
        label="Phone number"
        iconType={INPUT_ICON_TYPES.PHONE}
        onChange={onPhoneChange}
        value={phone}
        size="lg"
        error={error}
        placeholder="Enter your 10-digit phone number"
      />

      <Button
        disabled={!isPhoneValid || isLoading}
        variant="primary"
        onClick={onSendOTP}
        label={isLoading ? 'Sending...' : 'Send OTP'}
      />
    </div>
  )
}
