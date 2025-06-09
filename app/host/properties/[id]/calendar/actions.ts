'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/app/auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';

// Define schemas for validation
const availabilitySchema = z.object({
  startDate: z.date(),
  endDate: z.date().refine(data => data > new Date(), {
    message: 'End date must be in the future',
  }),
  delete: z.boolean().optional(),
});

const blockedDateSchema = z.object({
  startDate: z.date(),
  endDate: z.date().refine(data => data > new Date(), {
    message: 'End date must be in the future',
  }),
  reason: z.string().optional(),
  delete: z.boolean().optional(),
});

/**
 * Get property calendar data
 */
export async function getPropertyCalendar(propertyId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can access property calendar');
    }
    
    // Connect to database
    await dbConnect();
    
    // Find property with only the necessary fields for the calendar
    const property = await Property.findById(propertyId).select('title hostId availability blockedDates').lean();
    
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
    console.error('Error fetching property calendar:', error);
    throw new Error('Failed to fetch property calendar');
  }
}

/**
 * Update property availability
 */
export async function updateAvailability(propertyId: string, data: any) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can update property availability');
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
    const validatedData = availabilitySchema.parse(data);
    
    // If delete flag is true, remove the availability range
    if (validatedData.delete) {
      // Find and remove the availability range that matches the start and end dates
      property.availability = property.availability.filter((range: any) => {
        const startDate = new Date(range.startDate).toISOString();
        const endDate = new Date(range.endDate).toISOString();
        const validatedStartDate = new Date(validatedData.startDate).toISOString();
        const validatedEndDate = new Date(validatedData.endDate).toISOString();
        
        return startDate !== validatedStartDate || endDate !== validatedEndDate;
      });
    } else {
      // Check for overlapping availability ranges
      const isOverlapping = property.availability.some((range: any) => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const newStart = new Date(validatedData.startDate);
        const newEnd = new Date(validatedData.endDate);
        
        return (
          (newStart >= rangeStart && newStart <= rangeEnd) ||
          (newEnd >= rangeStart && newEnd <= rangeEnd) ||
          (newStart <= rangeStart && newEnd >= rangeEnd)
        );
      });
      
      if (isOverlapping) {
        throw new Error('The new availability range overlaps with an existing range');
      }
      
      // Add new availability range
      property.availability.push({
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
      });
    }
    
    // Update modified timestamp
    property.updatedAt = new Date();
    
    // Save property
    await property.save();
    
    // Revalidate paths
    revalidatePath(`/host/properties/${propertyId}/calendar`);
    revalidatePath(`/properties/${propertyId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating property availability:', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * Update property blocked dates
 */
export async function updateBlockedDates(propertyId: string, data: any) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can update property blocked dates');
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
    const validatedData = blockedDateSchema.parse(data);
    
    // If delete flag is true, remove the blocked date range
    if (validatedData.delete) {
      // Find and remove the blocked date range that matches the start and end dates
      property.blockedDates = property.blockedDates.filter((range: any) => {
        const startDate = new Date(range.startDate).toISOString();
        const endDate = new Date(range.endDate).toISOString();
        const validatedStartDate = new Date(validatedData.startDate).toISOString();
        const validatedEndDate = new Date(validatedData.endDate).toISOString();
        
        return startDate !== validatedStartDate || endDate !== validatedEndDate;
      });
    } else {
      // Check for overlapping blocked date ranges
      const isOverlapping = property.blockedDates.some((range: any) => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const newStart = new Date(validatedData.startDate);
        const newEnd = new Date(validatedData.endDate);
        
        return (
          (newStart >= rangeStart && newStart <= rangeEnd) ||
          (newEnd >= rangeStart && newEnd <= rangeEnd) ||
          (newStart <= rangeStart && newEnd >= rangeEnd)
        );
      });
      
      if (isOverlapping) {
        throw new Error('The new blocked date range overlaps with an existing range');
      }
      
      // Add new blocked date range
      property.blockedDates.push({
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        reason: validatedData.reason,
      });
    }
    
    // Update modified timestamp
    property.updatedAt = new Date();
    
    // Save property
    await property.save();
    
    // Revalidate paths
    revalidatePath(`/host/properties/${propertyId}/calendar`);
    revalidatePath(`/properties/${propertyId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating property blocked dates:', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}
