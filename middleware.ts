import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/auth';

// Middleware function to handle authentication
export async function middleware(request: NextRequest) {
  // Protected routes that require authentication
  // const protectedRoutes = [
  //   '/host',          // Host dashboard and property management
  //   // '/bookings',      // User's bookings
  //   '/profile',       // User profile
  //   '/wishlist',      // User's saved properties
  //   '/messages',      // User's messages
  //   '/account',       // Account settings
  //   '/payments'       // Payment information
  // ];
  
  // const url = request.nextUrl.pathname;
  
  // // Check if the current path requires authentication
  // const isProtectedRoute = protectedRoutes.some(route => url.startsWith(route));
  
  // // If not a protected route, allow access without authentication
  // if (!isProtectedRoute) {
  //   return NextResponse.next();
  // }
  
  // // Get token from cookie for protected routes
  // const token = request.cookies.get('auth-token')?.value;
  
  // // Check if user is authenticated for protected routes
  // if (!token) {
  //   // Redirect to login page
  //   const loginUrl = new URL('/auth/login', request.url);
  //   loginUrl.searchParams.set('callbackUrl', url);
  //   return NextResponse.redirect(loginUrl);
  // }
  
  // // Verify token
  // const user = await verifyToken(token);
  
  // if (!user) {
  //   // Invalid token, redirect to login
  //   const loginUrl = new URL('/auth/login', request.url);
  //   loginUrl.searchParams.set('callbackUrl', url);
  //   return NextResponse.redirect(loginUrl);
  // }
  
  // Continue to the route if authenticated
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
// export const config = {
//   matcher: [
//     // Only apply middleware to these protected routes
//     '/host/:path*',
//     '/bookings/:path*',
//     '/profile/:path*',
//     '/wishlist/:path*',
//     '/messages/:path*',
//     '/account/:path*',
//     '/payments/:path*',
//     // Exclude static files and assets
//     '/((?!_next/static|_next/image|favicon.ico|public).*)'
//   ],
// };
