import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/app/auth';

export async function POST(request: NextRequest) {
  try {
    // Clear the authentication cookie
    await clearAuthCookie();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
