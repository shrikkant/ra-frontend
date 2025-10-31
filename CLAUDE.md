# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Development
- `npm run dev` - Start development server with Node.js inspection and trace warnings
- `npm run build` - Build the Next.js application for production
- `npm start` - Start the production server
- `npm run build:css` - Build Tailwind CSS from source to global.css
- `npm run watch:css` - Watch and rebuild CSS on changes

### Code Quality and Testing
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS modules
- **State Management**: Redux Toolkit with Redux Persist
- **HTTP Client**: Axios with custom interceptors
- **UI Components**: Headless UI, Heroicons
- **Testing**: Jest with Testing Library

### Application Structure

#### Core Directories
- `app/` - Next.js App router pages and layouts
- `components/` - Reusable React components organized by domain
- `app-store/` - Redux store slices and state management
- `api/` - API service layers and HTTP client configuration
- `hooks/` - Custom React hooks for business logic
- `config/` - Environment configuration and constants
- `util/` - Utility functions and helpers
- `types/` - TypeScript type definitions

#### Key Architecture Patterns

**Environment Configuration**: The app uses a sophisticated environment setup in `config/environment.ts` with separate client-side and server-side API URLs. Use `getClientApiUrl()` for browser requests and `getServerApiUrl()` for server-side requests.

**API Layer**: HTTP services are built around `api/axios.config.ts` with interceptors for authentication and response formatting. The `fetchData()` function is used for server-side data fetching, while `httpClient` is used for client-side requests.

**State Management**: Redux store is configured with persistence in `app-store/store.ts`. State is organized by domain (auth, products, orders, admin) with each slice in its own directory.

**Component Organization**: Components follow a domain-driven structure:
- `components/common/` - Shared components (Header, Footer, Forms)
- `components/user/` - User-related components (authentication, profile)
- `components/admin/` - Admin dashboard components
- `components/product/` - Product display and booking components
- `components/booking/` - Booking flow components

### Authentication System
The app uses token-based authentication with JWT stored in cookies. The `auth.slice.ts` manages authentication state, and `axios.config.ts` automatically includes tokens in requests.

### Styling Approach
- Primary styling uses Tailwind CSS
- Component-specific styles use CSS modules (`.module.css`)
- Global styles and variables in `styles/` directory
- Custom Tailwind configuration in `tailwind.config.ts`

### Business Domain
This is a rental platform (RentAcross) focused on camera and equipment rentals. Key business entities include:
- Products (cameras, lenses, accessories)
- Orders and bookings
- Users and authentication
- Admin management
- Document verification (KYC)

### Development Workflow
1. Components are modular and follow SOLID principles (see REFACTORING_SUMMARY.md)
2. Business logic is extracted into custom hooks
3. Type safety is enforced with TypeScript interfaces
4. API calls use the configured HTTP client with proper error handling
5. State updates use Redux actions and selectors

### Testing Strategy
- Jest configuration supports Next.js testing
- Tests should use `@testing-library/react` for component testing
- Test files go in `__tests__/` directory
- Coverage reports are generated in `coverage/` directory

### Docker Support
The project includes Docker configurations:
- `Dockerfile.dev` and `Dockerfile.prod` for containerization
- `docker-compose.dev.yml` and `docker-compose.prod.yml` for orchestration

### Important Notes
- Always use the environment configuration helpers instead of hardcoding URLs
- Follow the established component modularization patterns
- Use the Redux store for application state, not local component state for shared data
- Implement proper error handling using the HTTP interceptors
- Respect the separation between client-side and server-side API calls