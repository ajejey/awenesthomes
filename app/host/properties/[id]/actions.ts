'use server';

import Property from '@/lib/models/property';
import dbConnect from '@/lib/db';
import { requireAuth } from '@/app/auth';
import mongoose from 'mongoose';

/**
 * Get a property by ID with host information
 */
export async function getPropertyById(id: string) {
  console.log(" id ", id);
  try {
    // Validate user is authenticated and is a host
    const user = await requireAuth(['host']);
    console.log(" user ", user);
    
    // Connect to database
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    // Fetch property with host information
    const property = await Property.findById(id)
      .populate('hostId', 'name email profileImage')
      .lean();

      console.log(" property ", property);
    
    if (!property) {
      return null;
    }
    
    // Ensure the property belongs to the current user
    if (property.hostId._id.toString() !== user.id) {
      console.log(" property.hostId._id.toString() !== user.id ", property.hostId._id.toString() !== user.id);
      return null;
    }

    console.log(" returning property ", property);
    
    // Convert MongoDB document to plain object and handle dates
    return JSON.parse(JSON.stringify(property));
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Update property status (publish/unpublish)
 */
export async function updatePropertyStatus(id: string, status: 'draft' | 'published') {
  try {
    // Validate user is authenticated and is a host
    const user = await requireAuth(['host']);
    
    // Connect to database
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid property ID' };
    }
    
    // Find property and ensure it belongs to the current user
    const property = await Property.findOne({ 
      _id: id,
      hostId: user.id
    });
    
    if (!property) {
      return { success: false, error: 'Property not found or you do not have permission' };
    }
    
    // Update the status
    property.status = status;
    await property.save();
    
    return { success: true };
  } catch (error) {
    console.error('Error updating property status:', error);
    return { success: false, error: 'Failed to update property status' };
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string) {
  try {
    // Validate user is authenticated and is a host
    const user = await requireAuth(['host']);
    
    // Connect to database
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid property ID' };
    }
    
    // Find property and ensure it belongs to the current user
    const result = await Property.deleteOne({ 
      _id: id,
      hostId: user.id
    });
    
    if (result.deletedCount === 0) {
      return { success: false, error: 'Property not found or you do not have permission' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: 'Failed to delete property' };
  }
}
