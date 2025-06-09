'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import React from 'react';

// Environment variables validation
const envSchema = z.object({
  JWT_SECRET_KEY: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

// Validate environment variables or use defaults
const env = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'your-secret-key-min-32-chars-long-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};

// User types
export type UserRole = 'guest' | 'host' | 'admin';

export interface UserJwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

// Create a JWT token
export async function createToken(payload: UserJwtPayload): Promise<string> {
  const secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
  
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secretKey);
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  console.log("verifyToken");
  try {
    const secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);
    console.log("payload ", payload);
    
    return payload as unknown as UserJwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: 'auth-token',
    path: '/',
  });
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserJwtPayload | null> {
  console.log("getCurrentUser");
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  console.log("token ", token);
  
  if (!token) {
    return null;
  }
  
  return await verifyToken(token);
}

// Server component authentication check
export async function requireAuth(allowedRoles?: UserRole[]): Promise<UserJwtPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // If roles are specified, check if user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Unauthorized access');
    }
  }
  
  return user;
}

// Role-based authentication check (kept for backward compatibility)
export async function requireRole(allowedRoles: UserRole[]): Promise<UserJwtPayload> {
  return requireAuth(allowedRoles);
}

// Middleware authentication check
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/verify',
    '/api/auth/otp',
  ];
  
  const url = request.nextUrl.pathname;
  
  // Allow access to public routes
  if (publicRoutes.includes(url) || url.startsWith('/api/auth/')) {
    return null; // Continue to the route
  }
  
  // Check if user is authenticated for protected routes
  if (!token) {
    // Redirect to login page
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token
  const user = await verifyToken(token);
  
  if (!user) {
    // Invalid token, redirect to login
    clearAuthCookie();
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', url);
    return NextResponse.redirect(loginUrl);
  }
  
  return null; // Continue to the route
}

// HOC for client components
// export function withAuth<P extends object>(Component: React.ComponentType<P>) {
//   return function AuthComponent(props: P) {
//     // This is just a placeholder - actual implementation would be in a client component
//     // that checks for user auth state and redirects if not authenticated
//     return React.createElement(Component, props);
//   };
// }
