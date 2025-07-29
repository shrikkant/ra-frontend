import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from '../app-store/auth/auth.slice'
import {generateLoginOTP, loginWithOTP} from '../api/user/index.api'
import {IUser} from '../app-store/types'
import {GA_EVENTS, trackGAEvent} from '../utils/analytics'
import {getUTMData} from '../app-store/session/session.slice'
import {HttpService} from '../api/axios.config'
import {
  SignInState,
  SignInActions,
  SignInHandlers,
  SignInValidators,
  SignInHookReturn,
} from '../types/signin.types'
import {SIGNIN_CONSTANTS} from '../config/signin.constants'

export const useSignIn = (onClose: () => void) => {
  const dispatch = useDispatch()
  const loggedUser = useSelector(selectAuthState)
  const utmData = useSelector(getUTMData)

  const [state, setState] = useState<SignInState>({
    phone: '',
    otp: '',
    otpSent: false,
    otpExpiry: 0,
    errors: {phone: ''},
    isLoading: false,
    isMobile: false,
  })

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth < SIGNIN_CONSTANTS.BREAKPOINTS.MOBILE,
      }))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const actions: SignInActions = {
    setPhone: (phone: string) => setState(prev => ({...prev, phone})),
    setOtp: (otp: string) => setState(prev => ({...prev, otp})),
    setOtpSent: (otpSent: boolean) => setState(prev => ({...prev, otpSent})),
    setOtpExpiry: (otpExpiry: number) =>
      setState(prev => ({...prev, otpExpiry})),
    setErrors: (errors: {phone: string}) =>
      setState(prev => ({...prev, errors})),
    setIsLoading: (isLoading: boolean) =>
      setState(prev => ({...prev, isLoading})),
    resetForm: () =>
      setState(prev => ({
        ...prev,
        phone: '',
        otp: '',
        otpSent: false,
        otpExpiry: 0,
        errors: {phone: ''},
      })),
  }

  const validatePhone = (phone: string): boolean => {
    const errors = {phone: ''}

    if (!phone || phone.length < 1) {
      errors.phone = 'Phone is required'
    } else if (phone.length !== SIGNIN_CONSTANTS.PHONE.MAX_LENGTH) {
      errors.phone = 'Invalid phone number'
    }

    actions.setErrors(errors)
    return errors.phone.length === 0
  }

  const handlePhoneChange = (phone: string) => {
    const errors = {phone: ''}

    if (/^\d*$/.test(phone)) {
      const limitedPhone = phone.slice(0, SIGNIN_CONSTANTS.PHONE.MAX_LENGTH)
      actions.setPhone(limitedPhone)
    } else {
      errors.phone = 'Invalid phone number'
    }

    actions.setErrors(errors)
  }

  const sendOTP = async () => {
    if (!validatePhone(state.phone)) {
      return
    }

    actions.setIsLoading(true)
    try {
      const response: any = await generateLoginOTP(state.phone, false)
      if (response.success) {
        actions.setOtpSent(true)
        actions.setOtpExpiry(response.expiryTimeInSeconds)
        trackGAEvent(GA_EVENTS.FORM_SUBMIT, {phone: state.phone})
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
    } finally {
      actions.setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (state.errors.phone.length > 0) {
      return
    }

    actions.setIsLoading(true)
    try {
      const loggedUser: IUser = await loginWithOTP(
        state.phone,
        state.otp,
        utmData,
      )
      if (loggedUser?.id) {
        dispatch(authUser(loggedUser))
        trackGAEvent(GA_EVENTS.LOGIN, {method: 'phone'})
        onClose()
      }
    } catch (error) {
      console.error('Error logging in:', error)
    } finally {
      actions.setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    const httpService = new HttpService('/')
    httpService
      .getClient()
      .post(`/auth/google`, utmData)
      .then(res => {
        if (res.success) {
          window.location.href = '/auth/google'
        }
      })
  }

  const onOtpTimeout = () => {
    actions.setOtpExpiry(0)
  }

  const handleOtpChange = (otp: string) => {
    actions.setOtp(otp)
  }

  const resetOtpForm = () => {
    actions.setOtp('')
    actions.setOtpSent(false)
    actions.setOtpExpiry(0)
  }

  const isPhoneValid = (): boolean => {
    return (
      state.phone.length === SIGNIN_CONSTANTS.PHONE.MAX_LENGTH &&
      state.errors.phone.length === 0
    )
  }

  const hasErrors = (): boolean => {
    return state.errors.phone.length > 0
  }

  return {
    state,
    actions,
    handlers: {
      handlePhoneChange,
      handleOtpChange,
      resetOtpForm,
      sendOTP,
      verifyOTP,
      handleGoogleSignIn,
      onOtpTimeout,
    },
    validators: {
      isPhoneValid,
      hasErrors,
    },
  } as SignInHookReturn
}
