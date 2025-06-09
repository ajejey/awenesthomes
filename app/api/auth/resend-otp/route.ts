import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOTP } from '@/app/auth/login/actions';

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate email
    const validationResult = emailSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    const { email } = validationResult.data;
    
    // Send OTP using the existing function
    const result = await sendOTP(email);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send OTP' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
