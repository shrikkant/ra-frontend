# Environment Configuration

This document explains the environment variables used in the application and how
to configure them.

## Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌──────────────────┐
│   Browser       │ ──────────────────► │  alpha.rentacross.com  │
│   (React/Next)  │                     │  (Next.js + Proxy)     │
└─────────────────┘                     └──────────────────┘
         │                                        │
         │                                        │
         │                                        ▼
         │                              ┌──────────────────┐
         │                              │  Node.js Server  │
         │                              │  (localhost:8082) │
         │                              └──────────────────┘
         │                                        ▲
         │                                        │
         └────────────────────────────────────────┘
              Direct Server-to-Server Calls
```

**Key Points:**

- **alpha.rentacross.com** → Serves the Next.js frontend application
- **alpha.rentacross.com/api/\*** → Proxied to Node.js server (localhost:8082)
- **Client-side**: Browser makes requests to same domain (`/api/`)
- **Server-side**: Next.js server makes direct calls to localhost:8082

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Client-Side API URLs (Browser → Same Domain Proxy)

```bash
# Main API base URL (browser requests to same domain)
NEXT_PUBLIC_CLIENT_API_BASE_URL=/api/

# API v1 URL (browser requests to same domain)
NEXT_PUBLIC_CLIENT_API_V1_URL=/api/v1/
```

### Server-Side API URLs (Next.js Server → External Node.js Server)

```bash
# Main API base URL (Next.js server direct calls)
SERVER_API_BASE_URL=http://localhost:8082/api/

# API v1 URL (Next.js server direct calls)
SERVER_API_V1_URL=http://localhost:8082/api/v1/

# DigiLocker API URL (Next.js server direct calls)
SERVER_DIGILOCKER_API_URL=http://localhost:8082/api/v1/
```

### Base URLs

```bash
# Main base URL
NEXT_PUBLIC_BASE_URL=https://alpha.rentacross.com

# WWW base URL (used for referrer headers)
NEXT_PUBLIC_BASE_URL_WWW=https://alpha.rentacross.com
```

### Legacy Support (for backward compatibility)

```bash
# Legacy environment variables (still supported)
REACT_APP_API_URL=https://alpha.rentacross.com/api/
REACT_APP_ENV=development
REACT_APP_URL=https://alpha.rentacross.com
```

### Environment

```bash
NODE_ENV=development
```

## Development vs Production

### Development Environment

```bash
# Client-side (Browser → Same Domain Proxy)
NEXT_PUBLIC_CLIENT_API_BASE_URL=/api/
NEXT_PUBLIC_CLIENT_API_V1_URL=/api/v1/

# Server-side (Next.js → Node.js Server)
SERVER_API_BASE_URL=http://localhost:8082/api/
SERVER_API_V1_URL=http://localhost:8082/api/v1/
SERVER_DIGILOCKER_API_URL=http://localhost:8082/api/v1/

# Base URLs
NEXT_PUBLIC_BASE_URL=https://alpha.rentacross.com
NEXT_PUBLIC_BASE_URL_WWW=https://alpha.rentacross.com
NODE_ENV=development
```

### Production Environment

```bash
# Client-side (Browser → Same Domain Proxy)
NEXT_PUBLIC_CLIENT_API_BASE_URL=/api/
NEXT_PUBLIC_CLIENT_API_V1_URL=/api/v1/

# Server-side (Next.js → Node.js Server)
SERVER_API_BASE_URL=https://api.rentacross.com/api/
SERVER_API_V1_URL=https://api.rentacross.com/api/v1/
SERVER_DIGILOCKER_API_URL=https://api.rentacross.com/api/v1/

# Base URLs
NEXT_PUBLIC_BASE_URL=https://rentacross.com
NEXT_PUBLIC_BASE_URL_WWW=https://www.rentacross.com
NODE_ENV=production
```

## Usage in Code

The environment variables are centralized in `config/environment.ts`:

```typescript
import {
  ENV_CONFIG,
  getClientApiUrl,
  getServerApiUrl,
} from '../config/environment'

// Client-side usage (browser)
const clientApiUrl = getClientApiUrl('base') // /api/
const clientApiV1Url = getClientApiUrl('v1') // /api/v1/

// Server-side usage (Next.js server)
const serverApiUrl = getServerApiUrl('base') // http://localhost:8082/api/
const serverApiV1Url = getServerApiUrl('v1') // http://localhost:8082/api/v1/

// Direct access
const apiUrl = ENV_CONFIG.CLIENT_API_BASE_URL
const serverUrl = ENV_CONFIG.SERVER_API_BASE_URL
```

## File-Specific Usage

| File                    | URL Used                    | Context     | Purpose                   |
| ----------------------- | --------------------------- | ----------- | ------------------------- |
| `api/axios.config.ts`   | `CLIENT_API_BASE_URL`       | Client-side | Browser HTTP client       |
| `app/utils/api.ts`      | `SERVER_API_V1_URL`         | Server-side | Next.js SSR data fetching |
| `api/digilocker.api.ts` | `SERVER_DIGILOCKER_API_URL` | Server-side | DigiLocker API calls      |
| Server Components       | `SERVER_API_V1_URL`         | Server-side | Server-side rendering     |
| Client Components       | `CLIENT_API_BASE_URL`       | Client-side | Client-side requests      |

## Key Differences

### Client-Side vs Server-Side

1. **Client-Side URLs** (`NEXT_PUBLIC_*`):
   - Used by browser JavaScript
   - Relative URLs (`/api/`, `/api/v1/`)
   - Same domain as the Next.js app
   - Proxied to Node.js server by domain configuration
   - Exposed to client-side code

2. **Server-Side URLs** (`SERVER_*`):
   - Used by Next.js server only
   - Direct URLs to Node.js server (`http://localhost:8082/api/`)
   - Can be internal network URLs
   - Not exposed to client-side code
   - Better performance (direct server-to-server)

### Why This Architecture?

- **CORS**: No CORS issues since client requests go to same domain
- **Security**: Server URLs can be internal network addresses
- **Performance**: Server can use faster direct connections
- **Flexibility**: Different URLs for different environments
- **Proxy**: Domain-level proxy handles routing `/api/*` to Node.js server

## Migration Notes

The following files have been updated to use the new environment configuration:

1. `api/axios.config.ts` - Updated to use `ENV_CONFIG.CLIENT_API_BASE_URL`
2. `app/utils/api.ts` - Updated to use `ENV_CONFIG.SERVER_API_V1_URL`
3. `api/digilocker.api.ts` - Updated to use
   `ENV_CONFIG.SERVER_DIGILOCKER_API_URL`
4. `config/constants.ts` - Updated to use the new environment configuration

All hardcoded URLs have been replaced with environment variables for better
maintainability and deployment flexibility.
