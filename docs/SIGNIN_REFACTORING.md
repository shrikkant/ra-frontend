# SignIn Component Refactoring

## Overview

The SignIn component has been refactored following SOLID principles to improve
maintainability, testability, and code organization.

## Architecture

### SOLID Principles Implementation

#### 1. Single Responsibility Principle (SRP)

Each component and hook has a single, well-defined responsibility:

- **`useSignIn` hook**: Manages all business logic and state
- **`SignInPhoneForm`**: Handles phone input UI
- **`SignInOTPForm`**: Handles OTP verification UI
- **`SignInGoogleSection`**: Handles Google sign-in UI
- **`SignInTrustIndicators`**: Displays trust indicators
- **`SignInHeader`**: Displays headers

#### 2. Open/Closed Principle (OCP)

The components are open for extension but closed for modification:

- New sign-in methods can be added by creating new components
- UI changes can be made by extending existing components
- Business logic can be extended through the hook

#### 3. Liskov Substitution Principle (LSP)

All components follow consistent interfaces and can be substituted:

- All form components follow the same prop patterns
- The hook provides a consistent API
- Types ensure interface compliance

#### 4. Interface Segregation Principle (ISP)

Interfaces are specific to their use cases:

- `SignInState` for state management
- `SignInHandlers` for event handlers
- `SignInValidators` for validation logic
- Component-specific prop interfaces

#### 5. Dependency Inversion Principle (DIP)

High-level modules don't depend on low-level modules:

- Components depend on interfaces, not concrete implementations
- The hook abstracts business logic from UI components
- Constants and types are injected rather than hardcoded

## File Structure

```
components/user/
├── SignInRefactored.tsx          # Main component
├── SignInPhoneForm.tsx           # Phone input form
├── SignInOTPForm.tsx             # OTP verification form
├── SignInGoogleSection.tsx       # Google sign-in section
├── SignInTrustIndicators.tsx     # Trust indicators
├── SignInHeader.tsx              # Header component
└── SignIn/
    └── index.ts                  # Exports

hooks/
└── useSignIn.ts                  # Business logic hook

types/
└── signin.types.ts               # Type definitions

config/
└── signin.constants.ts           # Constants

docs/
└── SIGNIN_REFACTORING.md         # This documentation
```

## Components

### SignInRefactored

The main component that orchestrates the sign-in flow. It uses the `useSignIn`
hook and renders the appropriate form based on the current state.

### SignInPhoneForm

Handles the phone number input and OTP sending functionality.

**Props:**

- `phone`: Current phone number
- `error`: Validation error message
- `isLoading`: Loading state
- `isPhoneValid`: Phone validation status
- `onPhoneChange`: Phone change handler
- `onSendOTP`: OTP sending handler

### SignInOTPForm

Handles OTP verification with countdown timer and resend functionality.

**Props:**

- `phone`: Phone number for display
- `otp`: Current OTP value
- `otpExpiry`: OTP expiry time
- `isLoading`: Loading state
- `onOtpChange`: OTP change handler
- `onVerifyOTP`: OTP verification handler
- `onResendOTP`: OTP resend handler
- `onOtpTimeout`: Timeout handler
- `onBackToPhone`: Back navigation handler

### SignInGoogleSection

Handles Google sign-in with divider and button.

**Props:**

- `onGoogleSignIn`: Google sign-in handler

### SignInTrustIndicators

Displays trust indicators (Secure, Quick, Trusted).

### SignInHeader

Displays headers with optional subtitle and centering.

**Props:**

- `title`: Header title
- `subtitle`: Optional subtitle
- `isCentered`: Center alignment flag

## Hook: useSignIn

The `useSignIn` hook encapsulates all business logic and state management.

### State

- `phone`: Phone number
- `otp`: OTP value
- `otpSent`: OTP sent status
- `otpExpiry`: OTP expiry time
- `errors`: Validation errors
- `isLoading`: Loading state
- `isMobile`: Mobile device detection

### Actions

- `setPhone`: Set phone number
- `setOtp`: Set OTP value
- `setOtpSent`: Set OTP sent status
- `setOtpExpiry`: Set OTP expiry time
- `setErrors`: Set validation errors
- `setIsLoading`: Set loading state
- `resetForm`: Reset form state

### Handlers

- `handlePhoneChange`: Phone input change handler
- `handleOtpChange`: OTP input change handler
- `resetOtpForm`: Reset OTP form
- `sendOTP`: Send OTP
- `verifyOTP`: Verify OTP
- `handleGoogleSignIn`: Google sign-in handler
- `onOtpTimeout`: OTP timeout handler

### Validators

- `isPhoneValid`: Phone validation
- `hasErrors`: Error check

## Types

### SignInState

Interface for the component state.

### SignInActions

Interface for state actions.

### SignInHandlers

Interface for event handlers.

### SignInValidators

Interface for validation functions.

### SignInHookReturn

Interface for the hook return value.

### SignInModalProps

Interface for the main component props.

## Constants

### SIGNIN_CONSTANTS

Centralized constants for:

- Phone validation rules
- OTP configuration
- Button labels
- Titles and messages
- Breakpoints

### TRUST_INDICATORS

Configuration for trust indicator display.

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Testability**: Components can be tested in isolation
3. **Reusability**: Components can be reused in other contexts
4. **Type Safety**: Strong typing prevents runtime errors
5. **Scalability**: Easy to add new features or modify existing ones
6. **Readability**: Clear separation of concerns makes code easier to understand

## Migration Guide

To migrate from the old SignIn component:

1. Replace imports:

   ```typescript
   // Old
   import SignIn from './components/user/SignIn'

   // New
   import {SignInRefactored as SignIn} from './components/user/SignIn'
   ```

2. Update any direct state access to use the hook's state
3. Update any direct function calls to use the hook's handlers

## Future Improvements

1. Add error boundaries for better error handling
2. Implement proper loading states with skeletons
3. Add accessibility improvements (ARIA labels, keyboard navigation)
4. Add unit tests for each component
5. Add integration tests for the complete flow
6. Implement proper form validation with libraries like Zod or Yup
