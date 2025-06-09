'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Property, { PropertyType, Amenity } from '@/lib/models/property';
import { getCurrentUser } from '@/app/auth';

// Define the property form schema
const propertyFormSchema = z.object({
  // Basic Information
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description cannot exceed 2000 characters'),
  propertyType: z.enum(['apartment', 'house', 'guesthouse', 'hotel', 'villa', 'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other'] as [PropertyType, ...PropertyType[]]),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
  beds: z.number().min(1, 'Property must have at least 1 bed'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
  maxGuests: z.number().min(1, 'Property must accommodate at least 1 guest'),
  
  // Location
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'Zip code is required'),
    country: z.string().default('India'),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),
  
  // Images
  images: z.array(
    z.object({
      url: z.string().url('Please provide a valid URL'),
      caption: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })
  ).min(1, 'At least one image is required'),
  
  // Amenities
  amenities: z.array(
    z.enum(['wifi', 'kitchen', 'ac', 'heating', 'tv', 'washer', 'dryer', 'parking', 'elevator', 'pool', 'hot_tub', 'gym', 'breakfast', 'workspace', 'fireplace', 'bbq', 'indoor_fireplace', 'smoking_allowed', 'pets_allowed', 'events_allowed'] as [Amenity, ...Amenity[]])
  ),
  
  // Pricing
  pricing: z.object({
    basePrice: z.number().min(100, 'Base price must be at least ₹100'),
    cleaningFee: z.number().min(0, 'Cleaning fee cannot be negative').default(0),
    serviceFee: z.number().min(0, 'Service fee cannot be negative').default(0),
    taxRate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').default(18),
    minimumStay: z.number().min(1, 'Minimum stay must be at least 1 night').default(1),
    maximumStay: z.number().min(1, 'Maximum stay must be at least 1 night').optional(),
    discounts: z.object({
      weekly: z.number().min(0, 'Weekly discount cannot be negative').max(100, 'Weekly discount cannot exceed 100%').optional(),
      monthly: z.number().min(0, 'Monthly discount cannot be negative').max(100, 'Monthly discount cannot exceed 100%').optional(),
    }).optional(),
  }),
  
  // Availability
  availability: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  ).min(1, 'At least one availability range is required'),
  
  // House Rules
  houseRules: z.array(z.string()).optional(),
  
  // Instant Booking
  instantBooking: z.boolean().default(false),
  
  // Status
  status: z.enum(['draft', 'published']).default('draft'),
});

// Define the form data type based on the schema
type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Create a new property
export async function createProperty(formData: PropertyFormData) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to create a property',
      };
    }
    
    // Validate user role (only hosts can create properties)
    if (user.role !== 'host' && user.role !== 'admin') {
      return {
        success: false,
        error: 'Only hosts can create properties',
      };
    }
    
    // Connect to database
    await dbConnect();
    
    // Parse and validate the form data
    const validatedData = propertyFormSchema.parse(formData);
    
    // Create a new property
    const property = new Property({
      ...validatedData,
      hostId: new mongoose.Types.ObjectId(user.id),
    });
    
    // Save the property to the database
    await property.save();
    
    // Revalidate the properties page
    revalidatePath('/host/properties');
    
    return {
      success: true,
      propertyId: property._id instanceof mongoose.Types.ObjectId 
        ? property._id.toString() 
        : String(property._id),
    };
  } catch (error) {
    console.error('Error creating property:', error);
    
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        error: 'Validation failed: ' + error.errors.map(e => e.message).join(', '),
      };
    }
    
    return {
      success: false,
      error: 'Failed to create property. Please try again.',
    };
  }
}

// Save property as draft
export async function savePropertyDraft(formData: PropertyFormData) {
  try {
    const result = await createProperty({
      ...formData,
      status: 'draft',
    });
    
    return result;
  } catch (error) {
    console.error('Error saving property draft:', error);
    
    return {
      success: false,
      error: 'Failed to save property draft. Please try again.',
    };
  }
}
