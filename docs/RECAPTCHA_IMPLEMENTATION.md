# Google reCAPTCHA v3 Implementation Guide

## Overview
This document outlines the implementation of Google reCAPTCHA v3 to protect the `addToCart` endpoint from bot abuse and spam attacks.

## Frontend Implementation ✅

### 1. Setup Environment Variables
Add your reCAPTCHA site key to `.env.local`:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

### 2. Components Modified
- ✅ `app/layout.tsx` - Added reCAPTCHA script loader
- ✅ `hooks/useRecaptcha.ts` - Created reusable hook for reCAPTCHA token generation
- ✅ `components/BookingForm.tsx` - Integrated reCAPTCHA before cart addition
- ✅ `api/user/orders.api.ts` - Updated to send reCAPTCHA token

## Backend Implementation Required ⚠️

### 1. Get reCAPTCHA Keys
1. Visit https://www.google.com/recaptcha/admin
2. Register your site with reCAPTCHA v3
3. Get both:
   - **Site Key** (public - already added to frontend)
   - **Secret Key** (private - needed for backend)

### 2. Backend Environment Variable
Add to your backend `.env`:
```bash
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Verify reCAPTCHA Token in `/user/carts` Endpoint

When the frontend sends a POST request to `/user/carts`, it now includes a `recaptchaToken` field:

```json
{
  "date": { ... },
  "product_id": 123,
  "recaptchaToken": "03AGdBq26..."
}
```

### Backend Verification Flow:

```javascript
// Example Node.js/Express implementation
const axios = require('axios');

async function verifyRecaptcha(token, expectedAction = 'add_to_cart') {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // 1. Verify token with Google's API
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: secretKey,
        response: token,
      },
    }
  );

  const { success, score, action, 'error-codes': errorCodes } = response.data;

  // 2. Check if verification succeeded
  if (!success) {
    console.error('reCAPTCHA verification failed:', errorCodes);
    throw new Error('reCAPTCHA verification failed');
  }

  // 3. Verify the action matches
  if (action !== expectedAction) {
    console.error(`Action mismatch: expected ${expectedAction}, got ${action}`);
    throw new Error('Invalid reCAPTCHA action');
  }

  // 4. Check score threshold (0.0 = bot, 1.0 = human)
  // Recommended: 0.5 for most cases
  // Stricter: 0.7+ for sensitive actions
  // Lenient: 0.3+ if you're getting false positives
  const SCORE_THRESHOLD = 0.5;

  if (score < SCORE_THRESHOLD) {
    console.warn(`Low reCAPTCHA score: ${score} (threshold: ${SCORE_THRESHOLD})`);
    throw new Error('Suspicious activity detected');
  }

  return { success: true, score };
}

// In your cart creation endpoint
app.post('/user/carts', async (req, res) => {
  try {
    const { recaptchaToken, product_id, date } = req.body;

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA token missing' });
    }

    await verifyRecaptcha(recaptchaToken, 'add_to_cart');

    // Apply rate limiting (reuse your existing infrastructure)
    // Example: similar to phone verification rate limiting
    await applyRateLimit(req.ip, 'add_to_cart', {
      maxRequests: 10,
      windowMs: 60 * 1000, // 10 requests per minute
    });

    // Process cart addition
    const cart = await createCart(product_id, date);

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);

    if (error.message === 'Suspicious activity detected') {
      return res.status(403).json({ error: 'Request blocked. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to add to cart' });
  }
});
```

### 4. Rate Limiting Integration

You mentioned having rate limiting infrastructure from phone verification. Apply it to the cart endpoint:

```javascript
// Example rate limiting (adapt to your existing infrastructure)
const rateLimitConfig = {
  'add_to_cart': {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute per IP
  },
};

// Apply the same pattern as your phone verification rate limiting
```

## Testing

### Testing reCAPTCHA in Development

1. **Lower score threshold** during development (0.1-0.3) to avoid blocking legitimate tests
2. **Google provides test keys** that always return `success: true`:
   - Site key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
   - Secret key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

3. **Monitor scores** in production to tune your threshold

### Expected Response from Google

```json
{
  "success": true,
  "challenge_ts": "2025-10-31T12:34:56Z",
  "hostname": "yourdomain.com",
  "score": 0.9,
  "action": "add_to_cart"
}
```

## Score Threshold Recommendations

| Threshold | Use Case | False Positive Risk |
|-----------|----------|---------------------|
| 0.9+ | Very sensitive actions (payment) | High |
| 0.7+ | Moderate protection | Medium |
| 0.5 | **Recommended for cart** | Low |
| 0.3 | Lenient (many false positives) | Very Low |

## Monitoring & Alerts

1. **Log suspicious activity** (low scores)
2. **Track blocked requests** by IP
3. **Monitor false positive rate** (legitimate users being blocked)
4. **Set up alerts** for sudden spikes in bot traffic

## Security Best Practices

✅ **DO:**
- Keep secret key secure (never expose to frontend)
- Log verification failures for monitoring
- Combine with rate limiting
- Monitor and adjust score threshold based on real data

❌ **DON'T:**
- Accept tokens without verification
- Use the same action name for different operations
- Set threshold too low (< 0.3) - defeats the purpose
- Block users without logging (you need data to tune)

## Next Steps

1. ✅ Get reCAPTCHA keys from Google
2. ⚠️ Add secret key to backend environment
3. ⚠️ Implement verification in `/user/carts` endpoint
4. ⚠️ Apply existing rate limiting to cart endpoint
5. ⚠️ Test with real users
6. ⚠️ Monitor scores and adjust threshold if needed

## Resources

- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Score Interpretation Guide](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)
