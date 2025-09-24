import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // --- Admin Route Protection ---
  // Any route inside /admin that is NOT the login page requires authentication.
  const isPublicAdminPath = path === '/admin/login';
  if (path.startsWith('/admin') && !isPublicAdminPath) {
    const sessionCookie = request.cookies.get('auth_session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // --- Client Portal Route Protection ---
  // Any route inside /client that is NOT the login page requires authentication.
  const isPublicClientPath = path === '/client/login';
  if (path.startsWith('/client') && !isPublicClientPath) {
    const sessionCookie = request.cookies.get('client_auth_session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }
  }


  return NextResponse.next();
}

// This config matches all paths under /admin and /client,
// allowing the middleware logic to decide which ones are public.
export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
}
