import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('access_token')?.value

  // if (currentUser && !request.nextUrl.pathname.startsWith('/portal')) {
  //   return Response.redirect(new URL('/portal', request.url))
  // }

  if (!currentUser && request.nextUrl.pathname.startsWith('/portal')) {
    return Response.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
