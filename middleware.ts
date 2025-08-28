import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('access_token')?.value

  // Clone the request headers and add pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // Handle authentication redirects
  if (!currentUser && request.nextUrl.pathname.startsWith('/portal')) {
    return Response.redirect(new URL('/signin', request.url))
  }

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
