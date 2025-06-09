'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/app/auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';
import { PropertyType, Amenity } from '@/lib/models/property';

// Define the property schema for validation
const propertyUpdateSchema = z.object({
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
  
  // Blocked Dates
  blockedDates: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
      reason: z.string().optional(),
    })
  ).optional(),
  
  // House Rules
  houseRules: z.array(z.string()).optional(),
  
  // Instant Booking
  instantBooking: z.boolean().default(false),
  
  // Status
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

/**
 * Get a property by ID
 */
export async function getProperty(propertyId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can access properties');
    }
    
    // Connect to database
    await dbConnect();
    
    // Find property
    const property = await Property.findById(propertyId).lean();
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Check if user owns the property or is admin
    if (property.hostId.toString() !== user.id.toString() && user.role !== 'admin') {
      throw new Error('You do not have permission to access this property');
    }
    
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(property));
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Update a property
 */
export async function updateProperty(propertyId: string, data: any) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can update properties');
    }
    
    // Connect to database
    await dbConnect();
    
    // Find property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Check if user owns the property or is admin
    if (property.hostId.toString() !== user.id.toString() && user.role !== 'admin') {
      throw new Error('You do not have permission to update this property');
    }
    
    // Validate data
    const validatedData = propertyUpdateSchema.parse(data);
    
    // Update property fields
    Object.keys(validatedData).forEach((key) => {
      // @ts-ignore
      property[key] = validatedData[key];
    });
    
    // Update modified timestamp
    property.updatedAt = new Date();
    
    // Save property
    await property.save();
    
    // Revalidate paths
    revalidatePath('/host/properties');
    revalidatePath(`/host/properties/${propertyId}/edit`);
    revalidatePath(`/properties/${propertyId}`);
    
    return { success: true, property: JSON.parse(JSON.stringify(property)) };
  } catch (error) {
    console.error('Error updating property:', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Failed to update property');
  }
}
