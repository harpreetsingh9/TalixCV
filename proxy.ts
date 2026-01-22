import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/app'];
const publicRoutes = ['/', '/login', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookie/token (we'll check localStorage on client side for this MVP)
  // For proxy, we'll just redirect unauthenticated users trying to access protected routes

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Redirect to login if accessing protected routes without auth
    // Note: In this MVP, actual auth check happens on client side
    // In production, you'd validate a proper auth token here
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)'],
};
