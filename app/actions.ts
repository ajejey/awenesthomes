'use server';

import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';
import { User } from '@/lib/models/user';
import { IPropertyCard } from '@/types';

/**
 * Fetch featured properties for the homepage
 * @returns Array of featured properties
 */
export async function getFeaturedProperties(): Promise<IPropertyCard[]> {
  try {
    await dbConnect();
    
    // Find published properties, limit to 8, sort by newest first
    const properties = await Property.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate({ path: 'hostId', select: 'name', model: User })
      .lean();
    
    if (!properties || properties.length === 0) {
      return [];
    }
    
    // Transform properties to the format expected by PropertyCard component
    const formattedProperties = properties.map((property) => ({
      _id: property._id.toString(),
      title: property.title,
      location: `${property.location.city}, ${property.location.state}`,
      price: property.pricing.basePrice,
      rating: property.rating || 0,
      imageUrl: property.images[0] || '/images/property-placeholder.jpg',
      host: {
        name: (property.hostId as any)?.name || 'Host',
      }
    }));
    
    return JSON.parse(JSON.stringify(formattedProperties));
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

/**
 * Search properties based on location, dates, guests, and category
 */
export async function searchProperties(
  location?: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number,
  category?: string
): Promise<IPropertyCard[]> {
  try {
    await dbConnect();
    
    // Build query based on provided parameters
    const query: any = { status: 'published' };
    
    // Add location search if provided
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.zipCode': { $regex: location, $options: 'i' } },
      ];
    }
    
    // Add category filter if provided
    if (category) {
      query.propertyType = category;
    }
    
    // Find properties matching the query
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({ path: 'hostId', select: 'name', model: User })
      .lean();
    
    if (!properties || properties.length === 0) {
      return [];
    }
    
    // Transform properties to the format expected by PropertyCard component
    const formattedProperties = properties.map((property) => ({
      _id: property._id.toString(),
      title: property.title,
      location: `${property.location.city}, ${property.location.state}`,
      price: property.pricing.basePrice,
      rating: property.rating || 0,
      imageUrl: property.images[0] || '/images/property-placeholder.jpg',
      host: {
        name: (property.hostId as any)?.name || 'Host',
      }
    }));
    
    return JSON.parse(JSON.stringify(formattedProperties));
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}
