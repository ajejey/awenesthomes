'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { createToken, getCurrentUser } from '@/app/auth';
import { cookies } from 'next/headers';
import { User } from '@/lib/models/user';
import { sendWelcomeEmail } from '@/lib/email';

// Define the managed onboarding schema with additional fields for managed hosting
const managedOnboardingSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  alternatePhone: z.string().optional(),
  
  // Property Information
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other']),
  bedrooms: z.number().int().min(1, 'Property must have at least 1 bedroom'),
  bathrooms: z.number().min(0.5, 'Property must have at least 0.5 bathroom'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please enter a valid state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  
  // Availability & Management
  availableFromDate: z.string().refine(date => !isNaN(new Date(date).getTime()), 'Please enter a valid date'),
  managementPreference: z.enum(['full_management', 'partial_management']),
  existingBookings: z.boolean(),
  existingBookingDetails: z.string().optional(),
  
  // Additional Information
  propertyPhotos: z.array(z.string()).optional(),
  specialRequests: z.string().optional(),
  
  // Terms & Conditions
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToCommission: z.boolean().refine(val => val === true, {
    message: 'You must agree to the commission structure',
  }),
});

export type ManagedOnboardingFormData = z.infer<typeof managedOnboardingSchema>;

/**
 * Complete the managed host onboarding process
 * Updates user role to 'host', sets managed hosting preference, and saves property information
 */
export async function completeManagedOnboarding(formData: ManagedOnboardingFormData) {
  try {
    // Validate the form data
    const validatedData = managedOnboardingSchema.parse(formData);
    
    // Connect to the database
    await dbConnect();
    
    // Get the current user from the cookie
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('You must be logged in to become a managed host');
    }
    
    // Update the user's role to 'host' and save host preferences with managed hosting flag
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      {
        role: 'host',
        name: validatedData.name,
        phone: validatedData.phone,
        hostPreferences: {
          propertyType: validatedData.propertyType,
          managedHosting: true,
          managementType: validatedData.managementPreference,
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
    
    // Send welcome email for managed hosting
    await sendWelcomeEmail(updatedUser.email, updatedUser.name);
    
    // Revalidate the paths
    revalidatePath('/host/properties');
    revalidatePath('/become-a-host');
    
    return { 
      success: true,
      message: 'Your managed hosting application has been submitted successfully. Our team will contact you within 24 hours.'
    };
  } catch (error: any) {
    console.error('Error completing managed host onboarding:', error);
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
export async function checkManagedHostStatus() {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // If not logged in, return redirect path instead of redirecting directly
      return {
        isLoggedIn: false,
        redirectTo: '/auth/login?redirect=/become-a-host/managed-onboarding'
      };
    }
    
    // If user is already a host, return redirect path instead of redirecting directly
    if (currentUser.role === 'host') {
      // Check if they're already a managed host
      const user = await User.findById(currentUser.id);
      if (user?.hostPreferences?.managedHosting) {
        return {
          isLoggedIn: true,
          isHost: true,
          isManagedHost: true,
          redirectTo: '/host/properties'
        };
      }
      
      // If they're a regular host, they can still apply for managed hosting
      return {
        isLoggedIn: true,
        isHost: true,
        isManagedHost: false,
        user: currentUser,
      };
    }
    
    return {
      isLoggedIn: true,
      isHost: false,
      user: currentUser,
    };
  } catch (error) {
    console.error('Error checking managed host status:', error);
    return {
      isLoggedIn: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
