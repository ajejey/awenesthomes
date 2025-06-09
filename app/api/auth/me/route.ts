import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/auth';

export async function GET(request: NextRequest) {
  console.log("request ", request);
  try {
    // Get the current user from the JWT token in the cookie
    const user = await getCurrentUser();

    console.log("user in me route ", user);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Return user data (without sensitive information)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
