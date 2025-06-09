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

// Signup validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['guest', 'host']).default('guest'),
  phone: z.string().optional(),
});

// OTP validation schema
const otpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['guest', 'host']).default('guest'),
  phone: z.string().optional(),
});

// Register user and send OTP
export async function registerUser(data: z.infer<typeof signupSchema>) {
  try {
    // Validate input
    const validatedData = signupSchema.parse(data);
    
    // Connect to database
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    
    if (existingUser && existingUser.isVerified) {
      return { success: false, error: 'Email already registered. Please login instead.' };
    }
    
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
    
    if (!emailResult.success) {
      return { success: false, error: 'Failed to send verification email. Please try again.' };
    }
    
    return { 
      success: true, 
      userData: {
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        phone: validatedData.phone
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: 'Failed to register. Please try again.' };
  }
}

// Verify OTP and complete registration
export async function verifyAndRegister(data: z.infer<typeof otpSchema>) {
  try {
    // Validate input
    const validatedData = otpSchema.parse(data);
    
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
    
    if (user) {
      // Update existing user
      user.name = validatedData.name;
      user.role = validatedData.role;
      user.isVerified = true;
      if (validatedData.phone) user.phone = validatedData.phone;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        phone: validatedData.phone,
        isVerified: true
      });
    }
    
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Send welcome email
    await sendWelcomeEmail(validatedData.email, validatedData.name);
    
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
    console.error('Error verifying registration:', error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: 'Failed to complete registration. Please try again.' };
  }
}
