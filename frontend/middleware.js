import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('cwb_token')?.value;

  // ================================
  // DASHBOARD
  // ================================

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = request.nextUrl.clone();

      url.pathname = '/login';
      url.searchParams.set('from', pathname);

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // ================================
  // ADMIN
  // ================================

  if (pathname.startsWith('/admin')) {
    // No token
    if (!token) {
      const url = request.nextUrl.clone();

      url.pathname = '/login';
      url.searchParams.set('from', pathname);

      return NextResponse.redirect(url);
    }

    // Get user from cookie
    const userCookie =
      request.cookies.get('cwb_user')?.value;

    try {
      if (!userCookie) {
        const url = request.nextUrl.clone();

        url.pathname = '/login';

        return NextResponse.redirect(url);
      }

      const user = JSON.parse(
        decodeURIComponent(userCookie)
      );

      // Check admin role
      if (!user || user.role !== 'admin') {
        const url = request.nextUrl.clone();

        url.pathname = '/login';

        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    } catch (error) {
      const url = request.nextUrl.clone();

      url.pathname = '/login';

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};