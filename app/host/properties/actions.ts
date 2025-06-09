'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/app/auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';

// Define filter schema
const filterSchema = z.object({
  status: z.enum(['all', 'published', 'draft', 'archived']).optional().default('all'),
  sortBy: z.enum(['newest', 'oldest', 'price-high', 'price-low', 'title']).optional().default('newest'),
  search: z.string().optional(),
});

type FilterParams = z.infer<typeof filterSchema>;

/**
 * Get all properties for the current host
 */
export async function getHostProperties(filters: FilterParams = { status: 'all', sortBy: 'newest' }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can access properties');
    }
    
    // Parse and validate filters
    const validatedFilters = filterSchema.parse(filters);
    
    // Connect to database
    await dbConnect();
    
    // Build query
    const query: any = { hostId: user.id };
    
    // Apply status filter
    if (validatedFilters.status && validatedFilters.status !== 'all') {
      query.status = validatedFilters.status;
    }
    
    // Apply search filter
    if (validatedFilters.search) {
      query.$or = [
        { title: { $regex: validatedFilters.search, $options: 'i' } },
        { 'location.city': { $regex: validatedFilters.search, $options: 'i' } },
        { 'location.state': { $regex: validatedFilters.search, $options: 'i' } },
      ];
    }
    
    // Determine sort order
    let sort: any = { createdAt: -1 }; // default: newest first
    
    switch (validatedFilters.sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price-high':
        sort = { 'pricing.basePrice': -1 };
        break;
      case 'price-low':
        sort = { 'pricing.basePrice': 1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
    }
    
    // Get total count
    const totalCount = await Property.countDocuments(query);
    
    // Get properties
    const properties = await Property.find(query)
      .sort(sort)
      .limit(50) // Limit to 50 properties per page for now
      .lean();

    console.log("properties", properties);
    
    // Convert MongoDB documents to plain objects
    return {
      properties: JSON.parse(JSON.stringify(properties)),
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching host properties:', error);
    throw new Error('Failed to fetch properties');
  }
}

/**
 * Update property status
 */
export async function updatePropertyStatus(
  propertyId: string,
  status: 'draft' | 'published' | 'archived'
) {
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
    
    // Update status
    property.status = status;
    await property.save();
    
    // Revalidate the properties page
    revalidatePath('/host/properties');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating property status:', error);
    throw new Error('Failed to update property status');
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can delete properties');
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
      throw new Error('You do not have permission to delete this property');
    }
    
    // Check if property has any bookings (we'll implement this later)
    // For now, we'll just delete the property
    
    await Property.findByIdAndDelete(propertyId);
    
    // Revalidate the properties page
    revalidatePath('/host/properties');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
}
