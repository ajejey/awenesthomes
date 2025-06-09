'use server';

import { z } from 'zod';
import dbConnect from '@/lib/db';
import { User, OTP } from '@/lib/models/user';
import { createToken, setAuthCookie, UserJwtPayload } from '@/app/auth';
import { sendOTPEmail, sendWelcomeEmail } from '@/lib/email';

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// OTP validation schema
const otpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Send OTP to user's email
export async function sendOTP(email: string) {
  console.log('Sending OTP to:', email);
  try {
    // Validate email
    const validatedData = emailSchema.parse({ email });
    
    // Connect to database
    await dbConnect();
    
    // Generate OTP
    const otp = generateOTP();
    
    // Set expiry time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email: validatedData.email },
      { 
        email: validatedData.email,
        otp,
        expiresAt
      },
      { upsert: true, new: true }
    );
    
    // Send OTP email
    const emailResult = await sendOTPEmail(validatedData.email, otp);
    console.log('Email result:', emailResult);    
    if (!emailResult.success) {
      return { success: false, error: 'Failed to send OTP email. Please try again.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    console.error('Error details:', error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
}

// Verify OTP and authenticate user
export async function verifyOTP(email: string, otp: string) {
  try {
    // Validate input
    const validatedData = otpSchema.parse({ email, otp });
    
    // Connect to database
    await dbConnect();
    
    // Find OTP in database
    const otpRecord = await OTP.findOne({ 
      email: validatedData.email,
      otp: validatedData.otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return { success: false, error: 'Invalid or expired OTP. Please try again.' };
    }
    
    // Find or create user
    let user = await User.findOne({ email: validatedData.email });
    
    if (!user) {
      // Create new user if not exists
      user = await User.create({
        email: validatedData.email,
        isVerified: true,
        role: 'guest'
      });
      
      // Send welcome email to new users
      await sendWelcomeEmail(validatedData.email);
    } else if (!user.isVerified) {
      // Update verification status if not already verified
      user.isVerified = true;
      await user.save();
    }
    
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Create JWT payload
    const payload: UserJwtPayload = {
      id: user._id ? user._id.toString() : '',
      email: user.email as string,
      role: user.role as 'guest' | 'host' | 'admin',
      name: user.name as string | undefined
    };
    
    // Create JWT token
    const token = await createToken(payload);
    
    // Set auth cookie
    await setAuthCookie(token);
    
    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: 'Failed to verify OTP. Please try again.' };
  }
}
