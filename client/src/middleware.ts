import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // If user is logged in, they shouldn't see login or register pages
    if (token) {
        if (pathname === '/login' || pathname === '/register') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // If user is NOT logged in, they shouldn't see protected pages
    // Protected pages: /dashboard, /admin, etc.
    const protectedPaths = ['/dashboard', '/admin', '/profile', '/settings', '/my-courses', '/quizzes', '/bookmarks'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/dashboard/:path*',
        '/admin/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/my-courses/:path*',
        '/quizzes/:path*',
        '/bookmarks/:path*',
    ],
};
