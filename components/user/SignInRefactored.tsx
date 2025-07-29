'use client'

import React from 'react'
import Modal from '../common/Modal'
import {useSignIn} from '../../hooks/useSignIn'
import {SignInPhoneForm} from './SignInPhoneForm'
import {SignInOTPForm} from './SignInOTPForm'
import {SignInGoogleSection} from './SignInGoogleSection'
import {SignInTrustIndicators} from './SignInTrustIndicators'
import {SignInHeader} from './SignInHeader'
import {SIGNIN_CONSTANTS} from '../../config/signin.constants'
import {SignInModalProps} from '../../types/signin.types'

export default function SignInRefactored({onClose}: SignInModalProps) {
  const {state, handlers, validators} = useSignIn(onClose)

  const handleCloseModal = () => {
    onClose()
  }

  const handleBackToPhone = () => {
    // Reset OTP form state and go back to phone input
    handlers.resetOtpForm()
  }

  return (
    <>
      {!state.otpSent && (
        <Modal
          show={true}
          onClose={handleCloseModal}
          title={SIGNIN_CONSTANTS.TITLES.WELCOME}
          logoTitle={true}
          fullScreen={false}
        >
          <div className={`${state.isMobile ? 'px-2 py-8' : 'm-auto'}`}>
            <div className="space-y-6">
              <SignInHeader title={SIGNIN_CONSTANTS.TITLES.LOGIN_SIGNUP} />

              <SignInPhoneForm
                phone={state.phone}
                error={state.errors.phone}
                isLoading={state.isLoading}
                isPhoneValid={validators.isPhoneValid()}
                onPhoneChange={handlers.handlePhoneChange}
                onSendOTP={handlers.sendOTP}
              />

              <SignInGoogleSection
                onGoogleSignIn={handlers.handleGoogleSignIn}
              />

              <SignInTrustIndicators />
            </div>
          </div>
        </Modal>
      )}

      {state.otpSent && (
        <Modal
          show={true}
          onClose={handleCloseModal}
          title={SIGNIN_CONSTANTS.TITLES.VERIFY_OTP}
          logoTitle={true}
          fullScreen={false}
        >
          <div className={`${state.isMobile ? 'px-2 py-8' : 'm-auto'}`}>
            <SignInOTPForm
              phone={state.phone}
              otp={state.otp}
              otpExpiry={state.otpExpiry}
              isLoading={state.isLoading}
              onOtpChange={handlers.handleOtpChange}
              onVerifyOTP={handlers.verifyOTP}
              onResendOTP={handlers.sendOTP}
              onOtpTimeout={handlers.onOtpTimeout}
              onBackToPhone={handleBackToPhone}
            />
          </div>
        </Modal>
      )}
    </>
  )
}
