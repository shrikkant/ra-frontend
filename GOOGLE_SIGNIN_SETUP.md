# Google Sign-In Setup Guide

## Prerequisites

1. A Google Cloud Console project
2. Google Sign-In API enabled
3. OAuth 2.0 credentials configured

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sign-In API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sign-In API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Choose "Web application" as the application type
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the generated Client ID

### 3. Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Backend API Setup

Ensure your backend has an endpoint to handle Google Sign-In:

```
POST /auth/google
Body: { token: string }
```

The endpoint should:

1. Verify the Google ID token
2. Extract user information
3. Create or update user in your database
4. Return user data with authentication tokens

### 5. Testing

1. Start your development server
2. Navigate to the sign-in page
3. Click "Continue with Google"
4. Complete the Google Sign-In flow
5. Verify the user is authenticated

## Troubleshooting

### Common Issues

1. **"Google Sign-In API not available"**
   - Ensure the Google Sign-In script is loaded
   - Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly

2. **"Invalid client ID"**
   - Verify the client ID matches your Google Cloud Console
   - Ensure the domain is authorized in OAuth settings

3. **"Redirect URI mismatch"**
   - Add your domain to authorized redirect URIs in Google Cloud Console

### Security Considerations

1. Always verify the ID token on your backend
2. Use HTTPS in production
3. Implement proper session management
4. Consider implementing CSRF protection

## API Reference

### Frontend Functions

- `handleGoogleSignIn()`: Initiates Google Sign-In flow
- `signInWithGoogle(token)`: Sends token to backend for verification

### Backend Endpoints

- `POST /auth/google`: Verifies Google ID token and authenticates user

## Support

For additional help, refer to:

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Google Cloud Console](https://console.cloud.google.com/)
