import { NextResponse } from 'next/server';

// Public admin routes that must NOT be protected (avoid redirect loop)
const ADMIN_PUBLIC = ['/admin/login'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Never block the admin login page itself
  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('cwb_token')?.value;

  // /dashboard — require any valid token
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // /admin (not /admin/login) — require token + admin role
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    // Check role from cookie
    const userStr = request.cookies.get('cwb_user')?.value;
    try {
      const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
      if (!user || user.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch (_) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
