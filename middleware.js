import { NextResponse } from 'next/server';

const locales = ['en', 'kh'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path is trying to access static files or api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Check for cookie
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = locales.includes(localeCookie) ? localeCookie : defaultLocale;

    // e.g. incoming request is /archive
    // The new URL is now /en/archive
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
