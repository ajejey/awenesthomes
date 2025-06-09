'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { createToken, getCurrentUser } from '@/app/auth';
import { cookies } from 'next/headers';
import { User } from '@/lib/models/user';

// Define the onboarding schema
const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other']),
  roomType: z.enum(['entire_place', 'private_room', 'shared_room']),
  hostingFrequency: z.enum(['full_time', 'part_time', 'occasionally']),
  agreeToRequirements: z.boolean().refine(val => val === true, {
    message: 'You must agree to the hosting requirements',
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

/**
 * Complete the host onboarding process
 * Updates user role to 'host' and saves host preferences
 */
export async function completeHostOnboarding(formData: OnboardingFormData) {
  try {
    // Validate the form data
    const validatedData = onboardingSchema.parse(formData);
    
    // Connect to the database
    await dbConnect();
    
    // Get the current user from the cookie
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('You must be logged in to become a host');
    }
    
    // Update the user's role to 'host' and save host preferences
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      {
        role: 'host',
        phone: validatedData.phone,
        hostPreferences: {
          propertyType: validatedData.propertyType,
          roomType: validatedData.roomType,
          hostingFrequency: validatedData.hostingFrequency,
          agreedToRequirements: validatedData.agreeToRequirements,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
        }
      },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new Error('Failed to update user information');
    }
    
    // Create a new JWT token with the updated role
    const token = await createToken({
      id: updatedUser._id ? updatedUser._id.toString() : updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name || '',
    });
    
    // Set the new token in the cookies
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    // Revalidate the paths
    revalidatePath('/host/properties');
    revalidatePath('/become-a-host');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error completing host onboarding:', error);
    return { 
      success: false, 
      error: error instanceof z.ZodError 
        ? error.errors.map(e => `${e.path}: ${e.message}`).join(', ')
        : error.message || 'Something went wrong'
    };
  }
}

/**
 * Check if the user is logged in and not already a host
 * Redirects to login if not logged in
 * Redirects to host dashboard if already a host
 */
export async function checkHostStatus() {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // If not logged in, return redirect path instead of redirecting directly
      return {
        isLoggedIn: false,
        redirectTo: '/auth/login?redirect=/become-a-host/onboarding'
      };
    }
    
    // If user is already a host, return redirect path instead of redirecting directly
    if (currentUser.role === 'host') {
      return {
        isLoggedIn: true,
        isHost: true,
        redirectTo: '/host/properties'
      };
    }
    
    return {
      isLoggedIn: true,
      isHost: false,
      user: currentUser,
    };
  } catch (error) {
    console.error('Error checking host status:', error);
    return {
      isLoggedIn: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
