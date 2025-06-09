'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/app/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { Types } from 'mongoose';

// Define the upload schema
const uploadSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  folder: z.string().optional(),
});

/**
 * Upload an image to Cloudinary
 * @param formData Form data containing the image
 * @returns Object containing the secure URL and public ID
 */
export async function uploadPropertyImage(formData: FormData) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      return {
        success: false,
        error: 'Only hosts can upload property images',
      };
    }
    
    // Get the image data from the form
    const imageData = formData.get('image');
    
    // Debug information
    console.log('Image data type:', typeof imageData);
    console.log('Image data length:', imageData ? (typeof imageData === 'string' ? imageData.length : 'N/A') : 'N/A');
    
    if (!imageData) {
      return {
        success: false,
        error: 'No image data provided.',
      };
    }
    
    if (typeof imageData !== 'string') {
      return {
        success: false,
        error: `Invalid image data type. Expected string, got ${typeof imageData}.`,
      };
    }
    
    const folder = `awenesthomes/properties/${user.id}`;
    
    // Validate the input
    const validated = uploadSchema.parse({ image: imageData, folder });
    
    // Upload the image to Cloudinary
    const result = await uploadImage(validated.image, folder);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to upload image',
      };
    }
    
    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
      };
    }
    
    return {
      success: false,
      error: 'Failed to upload image. Please try again.',
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId Public ID of the image to delete
 * @returns Success status
 */
export async function deletePropertyImage(publicId: string) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      return {
        success: false,
        error: 'Only hosts can delete property images',
      };
    }
    
    // Delete the image from Cloudinary
    const result = await deleteImage(publicId);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to delete image',
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    
    return {
      success: false,
      error: 'Failed to delete image. Please try again.',
    };
  }
}
