'use server';

import { z } from 'zod';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user';
import { requireAuth } from '@/app/auth';

// Get user profile data
export async function getUserProfile(userId: string) {
  // Verify authentication
  const currentUser = await requireAuth();
  
  if (!currentUser || (currentUser.id !== userId && currentUser.role !== 'admin')) {
    throw new Error('Unauthorized access');
  }
  
  try {
    await dbConnect();
    
    const user = await User.findById(userId).lean();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Convert MongoDB document to plain object and return
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

// Update profile schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

// Update user profile
export async function updateUserProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
  // Verify authentication
  const currentUser = await requireAuth();
  
  if (!currentUser || (currentUser.id !== userId && currentUser.role !== 'admin')) {
    return { success: false, error: 'Unauthorized access' };
  }
  
  try {
    // Validate input
    const validatedData = updateProfileSchema.parse(data);
    
    await dbConnect();
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name: validatedData.name,
        phone: validatedData.phone,
      },
      { new: true }
    ).lean();
    
    if (!updatedUser) {
      return { success: false, error: 'User not found' };
    }
    
    return { 
      success: true, 
      user: JSON.parse(JSON.stringify(updatedUser))
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    
    return { success: false, error: 'Failed to update profile' };
  }
}
