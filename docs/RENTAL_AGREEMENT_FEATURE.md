# Rental Agreement Feature

## Overview

The rental agreement feature allows users to view and sign rental agreements for
their orders. It replaces the previous document upload section with a more
streamlined e-signature process.

## Components

### 1. RentalAgreement Component (`components/common/RentalAgreement.tsx`)

- Main component that orchestrates the rental agreement flow
- Displays PDF viewer and signature buttons
- Integrates with e-signature modal

### 2. PDFViewer Component (`components/common/PDFViewer.tsx`)

- Reusable PDF viewer with download and fullscreen capabilities
- Handles loading states and error scenarios
- Provides a clean interface for PDF display

### 3. ESignatureModal Component (`components/common/ESignatureModal.tsx`)

- Canvas-based signature interface
- Supports drawing signatures with mouse/touch
- Provides clear and reset functionality

### 4. useRentalAgreement Hook (`hooks/useRentalAgreement.ts`)

- Manages all rental agreement state and logic
- Handles API calls and error states
- Provides clean interface for components

## API Endpoints

### 1. Get Rental Agreement PDF

```
GET /api/user/orders/${order_id}/rental-agreement/pdf
```

Returns: PDF blob

### 2. Initialize E-Signature

```
POST /api/user/orders/${order_id}/rental-agreement/sign/initialize
```

Returns: Signature initialization data

## Usage

The rental agreement component is integrated into the OrderDetails page:

```tsx
<RentalAgreement orderId={orderId} />
```

## Signature Flow

1. **Load PDF**: Component fetches and displays the rental agreement PDF
2. **Sign Now**: User clicks to initialize the signature process
3. **E-Signature**: Modal opens for user to draw their signature
4. **Complete**: Signature is captured and sent to backend
5. **Success**: Component shows signed status

## State Management

The component uses the following signature states:

- `unsigned`: Initial state, show "Sign Now" button
- `initializing`: Loading state during signature initialization
- `ready`: Ready for e-signature, show "Complete E-Signature" button
- `signed`: Signature completed, show success indicator

## Error Handling

- PDF loading errors with retry functionality
- Signature initialization errors
- Network connectivity issues
- Invalid signature attempts

## Future Enhancements

1. **Backend Integration**: Complete the signature submission to backend
2. **Digital Certificate**: Add digital certificate support
3. **Multi-party Signing**: Support for multiple signers
4. **Signature Templates**: Pre-defined signature positions
5. **Audit Trail**: Track signature history and timestamps
6. **Mobile Support**: Touch-optimized signature interface

## SOLID Principles Applied

- **Single Responsibility**: Each component has a single, well-defined purpose
- **Open/Closed**: Components are open for extension but closed for modification
- **Liskov Substitution**: Components can be easily replaced with alternatives
- **Interface Segregation**: Clean interfaces with minimal dependencies
- **Dependency Inversion**: Components depend on abstractions (hooks) rather
  than concrete implementations

## Testing Considerations

- Unit tests for hook logic
- Component integration tests
- API endpoint testing
- Error scenario testing
- Mobile responsiveness testing
